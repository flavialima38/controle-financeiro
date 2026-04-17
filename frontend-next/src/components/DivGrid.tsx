"use client";

import { PESSOAS, META_CONTRIBUICAO } from "@/lib/constants";
import { fmt } from "@/lib/finance";
import { parseValor } from "@/lib/finance";
import type { FinanceState } from "@/lib/types";

interface Props {
  state: FinanceState;
  onEditDevendo: (nome: string, valor: number) => void;
}

export default function DivGrid({ state, onEditDevendo }: Props) {
  const totContas = state.itens.reduce((s, it) => s + (it.valor || 0), 0);
  const parteContas = totContas / 4;

  return (
    <>
      <p className="sec">⚖️ Divisão por Pessoa</p>
      <div className="panel">
        <div className="phdr">
          <h2><span className="dot db"></span> Quanto cada um deve</h2>
          <small style={{ color: "var(--mut)", fontSize: ".68rem" }}>Combinado: R$ 1.000 cada</small>
        </div>
        <div className="pgrid">
          {PESSOAS.map(p => {
            const ent = Number(state.entradas[p.nome]) || 0;
            const faltaContribuir = Math.max(0, META_CONTRIBUICAO - ent);
            const quitou = ent >= META_CONTRIBUICAO;
            const pct = Math.min(100, (ent / META_CONTRIBUICAO) * 100);
            const devendo = Number(state.devendo?.[p.nome]) || 0;

            return (
              <div key={p.nome} className="pcard">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div className="pav" style={{ background: p.cor }}>{p.ini}</div>
                    <span className="pnm">{p.nome}</span>
                  </div>
                  {quitou ? (
                    <span style={{ fontSize: ".58rem", fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "rgba(74,222,128,.12)", color: "var(--grn)", border: "1px solid rgba(74,222,128,.25)" }}>✓ Contribuiu</span>
                  ) : (
                    <span style={{ fontSize: ".58rem", fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "rgba(248,113,113,.1)", color: "var(--red)", border: "1px solid rgba(248,113,113,.25)" }}>Falta {fmt(faltaContribuir)}</span>
                  )}
                </div>
                <div className="pr"><label>Combinado</label><span style={{ fontSize: ".78rem", fontWeight: 700 }}>{fmt(META_CONTRIBUICAO)}</span></div>
                <div className="pr"><label>Depositou</label><span style={{ fontSize: ".78rem", color: "var(--grn)", fontWeight: 700 }}>{fmt(ent)}</span></div>
                {totContas > 0 && (
                  <div className="pr"><label>Parte das contas (÷4)</label><span style={{ fontSize: ".75rem", color: "var(--yel)", fontWeight: 700 }}>{fmt(parteContas)}</span></div>
                )}
                <div className="pb-bg"><div className="pb" style={{ width: `${pct}%`, background: p.cor }}></div></div>
                <div style={{ marginTop: 8 }}>
                  <div className="pr" style={{ marginBottom: 6 }}><label>Ainda deve (editar)</label></div>
                  <div className="pvi">
                    <em>R$</em>
                    <input
                      type="text"
                      inputMode="decimal"
                      defaultValue={devendo ? devendo.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : ""}
                      placeholder="0,00"
                      onBlur={e => onEditDevendo(p.nome, parseValor(e.target.value))}
                    />
                  </div>
                </div>
                {devendo > 0 ? (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                    <span style={{ fontSize: ".62rem", color: "var(--red)", textTransform: "uppercase", letterSpacing: ".5px" }}>💸 Deve ainda</span>
                    <span style={{ fontSize: ".88rem", fontWeight: 800, color: "var(--red)" }}>{fmt(devendo)}</span>
                  </div>
                ) : quitou ? (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                    <span style={{ fontSize: ".62rem", color: "var(--grn)", textTransform: "uppercase", letterSpacing: ".5px" }}>✓ Em dia</span>
                    <span style={{ fontSize: ".85rem", fontWeight: 800, color: "var(--grn)" }}>{fmt(0)}</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                    <span style={{ fontSize: ".62rem", color: "var(--red)", textTransform: "uppercase", letterSpacing: ".5px" }}>Falta contribuir</span>
                    <span style={{ fontSize: ".85rem", fontWeight: 800, color: "var(--red)" }}>{fmt(faltaContribuir)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
