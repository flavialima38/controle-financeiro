"use client";

import type { FinanceSummary } from "@/lib/types";
import { fmt } from "@/lib/finance";

interface Props {
  summary: FinanceSummary;
}

export default function SummaryCards({ summary }: Props) {
  return (
    <div className="sgrid">
      <div className="card cg">
        <label>Fundo Total</label>
        <div className="v">{fmt(summary.fundoTotal)}</div>
      </div>
      <div className="card cr">
        <label>Total Gasto</label>
        <div className="v">{fmt(summary.totalSaidas)}</div>
      </div>
      <div className="card cy">
        <label>Mercado</label>
        <div className="v">{fmt(summary.totalMercado)}</div>
      </div>
      <div className="card cb">
        <label>Saldo do Fundo</label>
        <div className="v" style={{ color: summary.saldoFundo >= 0 ? "var(--grn)" : "var(--red)" }}>
          {fmt(summary.saldoFundo)}
        </div>
      </div>
    </div>
  );
}
