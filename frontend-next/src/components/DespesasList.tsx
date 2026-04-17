"use client";

import { useState } from "react";
import { FORMAS } from "@/lib/constants";
import { fmt, parseValor } from "@/lib/finance";
import type { FinanceState, DespesaItem } from "@/lib/types";

interface Props {
  state: FinanceState;
  onEditItem: (id: number, field: keyof DespesaItem, value: unknown) => void;
  onAddItem: () => void;
  onRemoveItem: (id: number) => void;
}

export default function DespesasList({ state, onEditItem, onAddItem, onRemoveItem }: Props) {
  const totContas = state.itens.reduce((s, it) => s + (it.valor || 0), 0);

  return (
    <>
      <p className="sec">📋 Despesas do Mês</p>
      <div className="panel">
        <div className="phdr">
          <h2><span className="dot dr"></span> Gastos Variáveis</h2>
          <small style={{ color: "var(--mut)", fontSize: ".72rem" }}>Soma ÷ 4 adultos</small>
        </div>
        <div className="ilist">
          {state.itens.map(it => (
            <ItemRow key={it.id} item={it} onEdit={onEditItem} onRemove={onRemoveItem} />
          ))}
        </div>
        {totContas > 0 && (
          <div style={{ padding: "0 13px 12px" }}>
            <div style={{
              background: "rgba(248,113,113,.06)", border: "1px solid rgba(248,113,113,.18)",
              borderRadius: 9, padding: "10px 12px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: ".72rem", color: "var(--mut)", textTransform: "uppercase", letterSpacing: ".8px", fontWeight: 600 }}>Total contas</span>
                <span style={{ fontSize: ".95rem", fontWeight: 800, color: "var(--red)" }}>{fmt(totContas)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: ".72rem", color: "var(--mut)", textTransform: "uppercase", letterSpacing: ".8px", fontWeight: 600 }}>÷ 4 = cada um paga</span>
                <span style={{ fontSize: ".95rem", fontWeight: 800, color: "var(--yel)" }}>{fmt(totContas / 4)}</span>
              </div>
            </div>
          </div>
        )}
        <button className="badd" onClick={onAddItem}>＋ Adicionar despesa</button>
      </div>
    </>
  );
}

function ItemRow({ item, onEdit, onRemove }: {
  item: FinanceState["itens"][0];
  onEdit: (id: number, field: keyof DespesaItem, value: unknown) => void;
  onRemove: (id: number) => void;
}) {
  const pg = item.status === "pago";
  const sc = pg ? "pg" : "pd";

  return (
    <div className="iwrap">
      <div className="irow">
        <span className="iico">{item.icon}</span>
        <div className="inm">
          <input
            type="text"
            defaultValue={item.nome}
            onBlur={e => onEdit(item.id, "nome", e.target.value)}
          />
        </div>
        <div className="vi">
          <em>R$</em>
          <input
            type="text"
            inputMode="decimal"
            defaultValue={item.valor ? item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : ""}
            placeholder="0,00"
            onBlur={e => onEdit(item.id, "valor", parseValor(e.target.value))}
          />
        </div>
        <span className={`smi ${sc}`}>{pg ? "✓ Pago" : "⏳ Pendente"}</span>
        <button className="brm" onClick={() => onRemove(item.id)}>✕</button>
      </div>
      <div className="prow">
        <label>Pgto:</label>
        <button className={`sbtn ${sc}`} onClick={() => onEdit(item.id, "status", null)}>
          {pg ? "✓ Pago" : "⏳ Pendente"}
        </button>
        <select defaultValue={item.forma} onChange={e => onEdit(item.id, "forma", e.target.value)}>
          {FORMAS.map(f => <option key={f.val} value={f.val}>{f.lab}</option>)}
        </select>
        <input
          type="date"
          defaultValue={item.dataPgto}
          onChange={e => onEdit(item.id, "dataPgto", e.target.value)}
        />
      </div>
    </div>
  );
}
