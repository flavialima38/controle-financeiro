"use client";

import { MESES } from "@/lib/constants";

interface Props {
  yr: number;
  mi: number;
  onChangeMonth: (dir: number) => void;
  onOpenCompras: () => void;
  onOpenMkt: () => void;
}

export default function Header({ yr, mi, onChangeMonth, onOpenCompras, onOpenMkt }: Props) {
  return (
    <header>
      <div className="hdr-top">
        <h1>🏠 Controle <span>Financeiro</span></h1>
        <div className="hdr-btns">
          <button className="hbtn hbtn-yel" onClick={onOpenCompras}>🧾 Compras</button>
          <button className="hbtn hbtn-grn" onClick={onOpenMkt}>🛒 Mercado</button>
        </div>
      </div>
      <div className="mnav">
        <button onClick={() => onChangeMonth(-1)} aria-label="Mês anterior">‹</button>
        <span id="mLabel">{MESES[mi]} {yr}</span>
        <button onClick={() => onChangeMonth(1)} aria-label="Próximo mês">›</button>
      </div>
    </header>
  );
}
