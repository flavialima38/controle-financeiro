/**
 * Funções de cálculo financeiro e formatação.
 */
import type { FinanceState, FinanceSummary, DespesaItem } from "./types";
import { META_CONTRIBUICAO, PESSOAS } from "./constants";

/** Formata um número como moeda brasileira. */
export function fmt(v: number | string): string {
  return "R$ " + parseFloat(String(v || 0)).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Converte string formatada em número. */
export function parseValor(s: string): number {
  const clean = s.replace(/R\$\s*/g, "").trim().replace(/\./g, "").replace(",", ".");
  return parseFloat(clean) || 0;
}

/** Formata data ISO para DD/MM/YYYY. */
export function fmtDate(d: string): string {
  if (!d) return "";
  const p = d.split("-");
  return `${p[2]}/${p[1]}/${p[0]}`;
}

/** Calcula o resumo financeiro. */
export function calcSummary(state: FinanceState): FinanceSummary {
  const fundoTotal = Object.values(state.entradas).reduce((s, v) => s + (Number(v) || 0), 0);
  const totalContas = state.itens.reduce((s, it) => s + (it.valor || 0), 0);
  const totalMercado = (state.compras || []).reduce((s, c) => s + (Number(c.valor) || 0), 0);
  const totalSaidas = totalContas + totalMercado;
  return {
    fundoTotal,
    totalContas,
    totalMercado,
    totalSaidas,
    saldoFundo: fundoTotal - totalSaidas,
    partePorPessoa: totalContas > 0 ? totalContas / 4 : 0,
  };
}

/** Cria um item de despesa padrão. */
export function newItem(id: number, icon: string, nome: string, valor: number): DespesaItem {
  return { id, icon, nome, valor, status: "pendente", forma: "", dataPgto: "" };
}

/** Retorna estado vazio de um novo mês. */
export function emptyState(): FinanceState {
  return {
    entradas: Object.fromEntries(PESSOAS.map(p => [p.nome, 0])),
    obs: Object.fromEntries(PESSOAS.map(p => [p.nome, ""])),
    devendo: Object.fromEntries(PESSOAS.map(p => [p.nome, 0])),
    itens: [
      newItem(1, "💧", "Água", 0),
      newItem(2, "⚡", "Luz", 0),
      newItem(3, "🔥", "Gás", 0),
    ],
    compras: [],
    nextId: 10,
  };
}

/** Calcula o que cada pessoa deve */
export function calcDivPerPerson(state: FinanceState) {
  const summary = calcSummary(state);
  return PESSOAS.map(p => {
    const ent = Number(state.entradas[p.nome]) || 0;
    const faltaContribuir = Math.max(0, META_CONTRIBUICAO - ent);
    const devendo = Number(state.devendo?.[p.nome]) || 0;
    const quitou = ent >= META_CONTRIBUICAO;
    return { pessoa: p, ent, faltaContribuir, quitou, devendo, parteContas: summary.partePorPessoa };
  });
}

/** Parseia a quantidade de um item de mercado. */
export function parseMktQty(qtyStr: string): number {
  if (!qtyStr) return 0;
  const range = qtyStr.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (range) return parseInt(range[2]);
  const single = qtyStr.match(/(\d+)/);
  if (single) return parseInt(single[1]);
  return 0;
}
