"use client";

import { useState } from "react";
import { fmt, fmtDate } from "@/lib/finance";
import type { FinanceState } from "@/lib/types";

interface Props {
  state: FinanceState;
  onOpenCompras: () => void;
  onRemoveCompra: (idx: number) => void;
  onOpenLightbox: (src: string) => void;
}

export default function ComprasList({ state, onOpenCompras, onRemoveCompra, onOpenLightbox }: Props) {
  const [openImgs, setOpenImgs] = useState<Set<number>>(new Set());

  const toggle = (idx: number) => {
    setOpenImgs(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const compras = state.compras || [];

  return (
    <>
      <p className="sec">🧾 Compras do Mês</p>
      <div className="panel">
        <div className="phdr">
          <h2><span className="dot dy"></span> Mercados visitados</h2>
          <button className="hbtn hbtn-yel" style={{ padding: "6px 10px", fontSize: ".72rem", minHeight: 36 }} onClick={onOpenCompras}>
            ＋ Registrar
          </button>
        </div>
        <div style={{ padding: "6px 0" }}>
          {compras.length === 0 ? (
            <div style={{ padding: 16, textAlign: "center", color: "var(--mut)", fontSize: ".8rem" }}>
              Nenhuma compra registrada ainda
            </div>
          ) : (
            compras.map((c, idx) => (
              <div key={idx} className="compra-item">
                <div className="compra-hdr" onClick={() => toggle(idx)}>
                  <span style={{ fontSize: "1rem" }}>🏪</span>
                  <span className="compra-loja">{c.loja}</span>
                  <span className="compra-data">{fmtDate(c.data)}</span>
                  <span className="compra-valor">{fmt(c.valor)}</span>
                  {c.imgB64 && <span style={{ fontSize: ".8rem", color: "var(--mut)" }}>📷</span>}
                  <button className="compra-brm" onClick={e => { e.stopPropagation(); onRemoveCompra(idx); }}>✕</button>
                </div>
                {c.imgB64 && openImgs.has(idx) && (
                  <div style={{ padding: "0 10px 10px" }}>
                    <img
                      className="compra-img"
                      src={c.imgB64}
                      alt={`Nota ${c.loja}`}
                      onClick={() => onOpenLightbox(c.imgB64!)}
                    />
                    {c.aiItems?.length > 0 && (
                      <div className="compra-ai-badge">✨ IA marcou {c.aiItems.length} itens na lista</div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
