"use client";

import { PESSOAS, META_CONTRIBUICAO } from "@/lib/constants";
import { fmt } from "@/lib/finance";
import { parseValor } from "@/lib/finance";
import type { FinanceState } from "@/lib/types";

interface Props {
  state: FinanceState;
  onEditEntrada: (nome: string, valor: number) => void;
  onEditObs: (nome: string, texto: string) => void;
}

export default function PessoasGrid({ state, onEditEntrada, onEditObs }: Props) {
  return (
    <>
      <p className="sec">💰 Contribuição por Pessoa</p>
      <div className="panel">
        <div className="phdr">
          <h2><span className="dot dg"></span> Entrada e saldo por pessoa</h2>
        </div>
        <div className="pgrid">
          {PESSOAS.map(p => {
            const ent = Number(state.entradas[p.nome]) || 0;
            const falta = META_CONTRIBUICAO - ent;
            const quitou = ent >= META_CONTRIBUICAO;
            const pct = Math.min(100, (ent / META_CONTRIBUICAO) * 100);
            const obs = state.obs?.[p.nome] || "";

            return (
              <div key={p.nome} className="pcard">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div className="pav" style={{ background: p.cor }}>{p.ini}</div>
                    <span className="pnm">{p.nome}</span>
                  </div>
                  <span style={{
                    fontSize: ".62rem", fontWeight: 700, padding: "3px 8px", borderRadius: 20,
                    background: quitou ? "rgba(74,222,128,.12)" : "rgba(248,113,113,.1)",
                    color: quitou ? "var(--grn)" : "var(--red)",
                    border: `1px solid ${quitou ? "rgba(74,222,128,.25)" : "rgba(248,113,113,.25)"}`,
                  }}>
                    {quitou ? "✓ Quitado" : `Falta ${fmt(falta)}`}
                  </span>
                </div>
                <div className="pr">
                  <label>Depositou no fundo</label>
                  <div className="pvi">
                    <em>R$</em>
                    <input
                      type="text"
                      inputMode="decimal"
                      defaultValue={ent ? ent.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : ""}
                      placeholder="0,00"
                      onBlur={e => onEditEntrada(p.nome, parseValor(e.target.value))}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".68rem", color: "var(--mut)", margin: "5px 0 3px" }}>
                  <span>Combinado</span><span style={{ fontWeight: 700 }}>{fmt(META_CONTRIBUICAO)}</span>
                </div>
                <div className="pb-bg"><div className="pb" style={{ width: `${pct}%`, background: p.cor }}></div></div>
                <textarea
                  placeholder="Observação..."
                  rows={2}
                  defaultValue={obs}
                  onBlur={e => onEditObs(p.nome, e.target.value)}
                  style={{
                    width: "100%", marginTop: 8, background: "var(--sur2)", border: "1px solid var(--bor)",
                    color: "var(--txt)", fontFamily: "'DM Sans',sans-serif", fontSize: ".72rem",
                    borderRadius: 7, padding: "6px 8px", outline: "none", resize: "none", lineHeight: 1.4,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
