"use client";

import { useState, useCallback } from "react";
import { useFinanceState } from "@/hooks/useFinanceState";
import { useToast } from "@/hooks/useToast";
import { calcSummary, fmt, fmtDate } from "@/lib/finance";
import { PESSOAS, FORMAS, META_CONTRIBUICAO, MESES } from "@/lib/constants";

import Header from "@/components/Header";
import SummaryCards from "@/components/SummaryCards";
import RecvGrid from "@/components/RecvGrid";
import PessoasGrid from "@/components/PessoasGrid";
import DespesasList from "@/components/DespesasList";
import ComprasList from "@/components/ComprasList";
import DivGrid from "@/components/DivGrid";
import FooterBar from "@/components/FooterBar";
import ModalCompras from "@/components/ModalCompras";
import ModalMercado from "@/components/ModalMercado";
import Lightbox from "@/components/Lightbox";
import Toast from "@/components/Toast";

export default function HomePage() {
  const finance = useFinanceState();
  const toast = useToast();

  const [comprasOpen, setComprasOpen] = useState(false);
  const [mktOpen, setMktOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const summary = calcSummary(finance.state);

  const handleReset = useCallback(() => {
    if (confirm("Limpar todos os dados deste mês?")) {
      finance.resetMes();
      toast.show("Mês limpo!");
    }
  }, [finance, toast]);

  const handleSalvar = useCallback(() => {
    finance.salvarExplicito();
    toast.show("✓ Dados salvos!");
  }, [finance, toast]);

  const handleSaveCompra = useCallback((compra: Parameters<typeof finance.addCompra>[0]) => {
    finance.addCompra(compra);
    toast.show("✓ Compra salva!");
  }, [finance, toast]);

  /* ── Resumo PDF ── */
  const gerarResumoPDF = useCallback(() => {
    const state = finance.state;
    const mesNome = MESES[finance.mi] + " " + finance.yr;
    const totContas = state.itens.reduce((s, i) => s + i.valor, 0);
    const totMkt = (state.compras || []).reduce((s, c) => s + Number(c.valor || 0), 0);
    const fundo = Object.values(state.entradas).reduce((s, v) => s + Number(v || 0), 0);
    const totalSaidas = totContas + totMkt;
    const saldoFundo = fundo - totalSaidas;
    const parteContas = totContas / 4;

    let html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
      <title>Resumo Financeiro - ${mesNome}</title>
      <style>
        body{font-family:"Segoe UI",Arial,sans-serif;margin:0;padding:30px 40px;color:#1a1a2e;font-size:13px;line-height:1.5}
        h1{font-size:22px;margin:0 0 4px}
        .sub{font-size:13px;color:#666;margin-bottom:20px}
        .section{margin-bottom:22px}
        .section-title{font-size:14px;font-weight:700;border-bottom:2px solid #6c8fff;padding-bottom:5px;margin-bottom:10px}
        table{width:100%;border-collapse:collapse;margin-bottom:8px}
        th{background:#f0f2f8;text-align:left;padding:7px 10px;font-size:11px;text-transform:uppercase;color:#555;border-bottom:2px solid #ddd}
        td{padding:7px 10px;border-bottom:1px solid #eee;font-size:12px}
        .val{font-weight:700;text-align:right}
        .green{color:#16a34a} .red{color:#dc2626} .yellow{color:#d97706} .blue{color:#2563eb}
        .badge{display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px}
        .badge-ok{background:#dcfce7;color:#16a34a} .badge-pend{background:#fef3c7;color:#d97706} .badge-late{background:#fee2e2;color:#dc2626}
        .summary-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;margin-bottom:20px}
        .sum-card{background:#f8f9fc;border:1px solid #e2e5f0;border-radius:8px;padding:12px;text-align:center}
        .sum-card .lbl{font-size:10px;text-transform:uppercase;color:#888;margin-bottom:4px}
        .sum-card .val{font-size:18px;font-weight:800;text-align:center}
        .highlight-row{background:#f0f7ff}
        .footer-note{font-size:10px;color:#999;text-align:center;margin-top:30px;border-top:1px solid #eee;padding-top:12px}
        @media print{body{padding:20px 25px}}
      </style></head><body>`;

    html += `<h1>🏠 Resumo Financeiro</h1>`;
    html += `<div class="sub">${mesNome} — Gerado em ${new Date().toLocaleDateString("pt-BR")}</div>`;

    html += `<div class="summary-grid">
      <div class="sum-card"><div class="lbl">Fundo Total</div><div class="val green">${fmt(fundo)}</div></div>
      <div class="sum-card"><div class="lbl">Total Gasto</div><div class="val red">${fmt(totalSaidas)}</div></div>
      <div class="sum-card"><div class="lbl">Mercado</div><div class="val yellow">${fmt(totMkt)}</div></div>
      <div class="sum-card"><div class="lbl">Saldo</div><div class="val ${saldoFundo >= 0 ? "blue" : "red"}">${fmt(saldoFundo)}</div></div>
    </div>`;

    html += `<div class="section"><div class="section-title">💰 Contribuições (R$ 1.000 cada)</div>
      <table><tr><th>Pessoa</th><th>Depositou</th><th>Falta</th><th>Status</th></tr>`;
    PESSOAS.forEach(p => {
      const ent = Number(state.entradas[p.nome] || 0);
      const falta = Math.max(0, META_CONTRIBUICAO - ent);
      const ok = ent >= META_CONTRIBUICAO;
      html += `<tr><td><strong>${p.nome}</strong></td><td class="val green">${fmt(ent)}</td>
        <td class="val ${ok ? "green" : "red"}">${ok ? "R$ 0,00" : fmt(falta)}</td>
        <td>${ok ? '<span class="badge badge-ok">✓ Quitado</span>' : '<span class="badge badge-late">Pendente</span>'}</td></tr>`;
    });
    html += `</table></div>`;

    if (state.itens.length) {
      html += `<div class="section"><div class="section-title">📋 Gastos Variáveis</div>
        <table><tr><th>Despesa</th><th>Valor</th><th>Status</th></tr>`;
      state.itens.forEach(it => {
        html += `<tr><td>${it.icon} ${it.nome}</td><td class="val">${it.valor ? fmt(it.valor) : "—"}</td>
          <td>${it.status === "pago" ? '<span class="badge badge-ok">✓ Pago</span>' : '<span class="badge badge-pend">⏳ Pendente</span>'}</td></tr>`;
      });
      if (totContas > 0) {
        html += `<tr class="highlight-row"><td><strong>TOTAL</strong></td><td class="val red">${fmt(totContas)}</td><td></td></tr>`;
        html += `<tr class="highlight-row"><td><strong>÷ 4 = cada um</strong></td><td class="val yellow">${fmt(parteContas)}</td><td></td></tr>`;
      }
      html += `</table></div>`;
    }

    html += `<div class="footer-note">Controle Financeiro de Casa — ${mesNome}</div></body></html>`;

    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); setTimeout(() => win.print(), 500); }
  }, [finance]);

  return (
    <>
      <Header yr={finance.yr} mi={finance.mi} onChangeMonth={finance.changeMonth}
        onOpenCompras={() => setComprasOpen(true)} onOpenMkt={() => setMktOpen(true)} />

      <div className="wrap" key={`${finance.yr}_${finance.mi}`}>
        <SummaryCards summary={summary} />
        <RecvGrid state={finance.state} yr={finance.yr} mi={finance.mi} />
        <PessoasGrid state={finance.state} onEditEntrada={finance.editEntrada} onEditObs={finance.editObs} />
        <ComprasList state={finance.state} onOpenCompras={() => setComprasOpen(true)}
          onRemoveCompra={finance.removeCompra} onOpenLightbox={setLightboxSrc} />
        <DespesasList state={finance.state} onEditItem={finance.editItem}
          onAddItem={finance.addItem} onRemoveItem={finance.removeItem} />
        <DivGrid state={finance.state} onEditDevendo={finance.editDevendo} />
      </div>

      <FooterBar onReset={handleReset} onResumoPDF={gerarResumoPDF} onSalvar={handleSalvar} />
      <Toast message={toast.message} visible={toast.visible} />

      <ModalCompras open={comprasOpen} onClose={() => setComprasOpen(false)} onSave={handleSaveCompra} />
      <ModalMercado open={mktOpen} mktState={finance.mktState} onClose={() => setMktOpen(false)}
        onLoadMkt={finance.loadMkt} onToggle={finance.toggleMktItem} onEditBought={finance.editMktBought}
        onAddItem={finance.addMktItem} onReset={finance.resetMkt} />
      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </>
  );
}
