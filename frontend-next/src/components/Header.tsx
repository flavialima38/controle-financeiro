"use client";

import { MESES } from "@/lib/constants";

interface Props {
  yr: number;
  mi: number;
  onChangeMonth: (dir: number) => void;
  onOpenCompras: () => void;
  onOpenMkt: () => void;
  userEmail?: string;
  onLogout?: () => void;
}

export default function Header({ yr, mi, onChangeMonth, onOpenCompras, onOpenMkt, userEmail, onLogout }: Props) {
  return (
    <header>
      {userEmail && (
        <div className="user-bar">
          <span>👤 {userEmail}</span>
          <button className="logout-btn" onClick={onLogout}>Sair</button>
        </div>
      )}
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

