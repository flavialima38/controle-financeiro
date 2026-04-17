"use client";

import { PESSOAS } from "@/lib/constants";
import type { FinanceState } from "@/lib/types";

interface Props {
  state: FinanceState;
  yr: number;
  mi: number;
}

export default function RecvGrid({ state, yr, mi }: Props) {
  const hoje = new Date();
  const isMesAtual = hoje.getMonth() === mi && hoje.getFullYear() === yr;

  return (
    <>
      <p className="sec">📅 Previsão de Recebimentos</p>
      <div className="panel">
        <div className="phdr">
          <h2><span className="dot dp"></span> Quando cada um recebe</h2>
        </div>
        <div className="recv-grid">
          {PESSOAS.map(p => {
            const recebeu = (Number(state.entradas[p.nome]) || 0) > 0;
            let status: string, statusCls: string;
            if (recebeu) { status = "✓ Recebido"; statusCls = "recv-ok"; }
            else if (!isMesAtual) { status = "Mês futuro"; statusCls = "recv-pend"; }
            else { status = "Aguardando"; statusCls = "recv-pend"; }

            return (
              <div key={p.nome} className="recv-card">
                <div className="recv-nome">
                  <div className="pav" style={{ background: p.cor, width: 24, height: 24, fontSize: ".65rem" }}>{p.ini}</div>
                  {p.nome}
                </div>
                <div className="recv-dia">📅 {p.recebeDia}</div>
                <span className={`recv-status ${statusCls}`}>{status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
