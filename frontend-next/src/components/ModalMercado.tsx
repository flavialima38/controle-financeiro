"use client";

import { useState, useEffect } from "react";
import { MKT_DEFAULT, MKT_DICAS } from "@/lib/constants";
import { parseMktQty } from "@/lib/finance";
import type { MktState } from "@/lib/types";

interface Props {
  open: boolean;
  mktState: MktState;
  onClose: () => void;
  onLoadMkt: () => void;
  onToggle: (id: number) => void;
  onEditBought: (id: number, qty: number) => void;
  onAddItem: (nome: string, qty: string) => void;
  onReset: () => void;
}

export default function ModalMercado({ open, mktState, onClose, onLoadMkt, onToggle, onEditBought, onAddItem, onReset }: Props) {
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (open) onLoadMkt(); }, [open, onLoadMkt]);

  const catMeta: Record<string, string | undefined> = {};
  MKT_DEFAULT.forEach(cd => { catMeta[cd.cat] = cd.tip; });

  const cats: Record<string, typeof mktState.list> = {};
  MKT_DEFAULT.forEach(cd => { cats[cd.cat] = []; });
  mktState.list.forEach(it => {
    if (!cats[it.cat]) cats[it.cat] = [];
    cats[it.cat].push(it);
  });

  const done = mktState.list.filter(i => i.done).length;

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddItem(newName.trim(), newQty.trim());
    setNewName(""); setNewQty("");
  };

  if (!open) return null;

  return (
    <div className="overlay open">
      <div className="modal">
        <div className="mhdr">
          <h2>🛒 Lista de Mercado <small style={{ fontSize: ".68rem", color: "var(--mut)", fontWeight: 400 }}>6 pessoas</small></h2>
          <button className="mclose" onClick={onClose}>✕</button>
        </div>
        <div className="mscroll">
          {Object.entries(cats).map(([cat, items]) => {
            if (!items.length) return null;
            const tip = catMeta[cat];
            return (
              <div key={cat} className="mkt-cat">
                <div className="mkt-cat-title">
                  {cat}
                  {tip && <span className="mkt-tip">💡 {tip}</span>}
                </div>
                <div className="mkt-grid">
                  {items.map(it => {
                    const comp = it.comprado || 0;
                    const needed = parseMktQty(it.qty);
                    let remainHtml = null;
                    if (needed > 0) {
                      const falta = Math.max(0, needed - comp);
                      remainHtml = falta === 0
                        ? <span className="mkt-bought-remaining ok">✓ Completo</span>
                        : <span className="mkt-bought-remaining pending">Falta {falta}</span>;
                    } else if (comp > 0) {
                      remainHtml = <span className="mkt-bought-remaining ok">{comp} comprado(s)</span>;
                    }

                    return (
                      <div key={it.id} className={`mkt-item${it.done ? " done" : ""}`}>
                        <div className="mkt-chk" onClick={() => onToggle(it.id)}>{it.done ? "✓" : ""}</div>
                        <div style={{ flex: 1, minWidth: 0 }} onClick={() => onToggle(it.id)}>
                          <div className="mkt-item-name">{it.nome}</div>
                          <div className="mkt-item-qty">Precisa: {it.qty}</div>
                        </div>
                        <div className="mkt-bought-row" onClick={e => e.stopPropagation()}>
                          <input
                            className="mkt-bought-input"
                            type="number"
                            inputMode="numeric"
                            min={0}
                            defaultValue={comp || ""}
                            placeholder="0"
                            onChange={e => onEditBought(it.id, parseInt(e.target.value) || 0)}
                          />
                          {remainHtml}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div className="mkt-cat">
            <div className="mkt-cat-title" style={{ color: "var(--yel)" }}>💡 Dicas Importantes</div>
            {MKT_DICAS.map((d, i) => <div key={i} className="mkt-dica">{d}</div>)}
          </div>
          <div className="mkt-add-row">
            <input type="text" placeholder="Adicionar item personalizado..."
              value={newName} onChange={e => setNewName(e.target.value)} maxLength={200} />
            <div className="mkt-add-btns">
              <input type="text" className="mkt-add-qty" placeholder="Quantidade"
                value={newQty} onChange={e => setNewQty(e.target.value)} maxLength={50} />
              <button className="mkt-add-btn" onClick={handleAdd}>＋ Adicionar</button>
            </div>
          </div>
        </div>
        <div className="mkt-footer">
          <span className="mkt-progress">Marcados: <strong>{done}</strong> / {mktState.list.length}</span>
          <button className="mkt-clear" onClick={onReset}>↺ Desmarcar todos</button>
        </div>
      </div>
    </div>
  );
}
