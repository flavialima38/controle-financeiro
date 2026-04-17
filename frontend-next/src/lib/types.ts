import { z } from "zod";

/* ── Pessoa ── */
export interface Pessoa {
  readonly nome: string;
  readonly cor: string;
  readonly ini: string;
  readonly recebeDia: string;
}

/* ── Item de despesa ── */
export interface DespesaItem {
  id: number;
  icon: string;
  nome: string;
  valor: number;
  status: "pendente" | "pago";
  forma: string;
  dataPgto: string;
  comprovante?: string;
}

/* ── Compra registrada ── */
export interface Compra {
  loja: string;
  data: string;
  valor: number;
  imgB64: string | null;
  aiItems: string[];
}

/* ── Estado financeiro mensal ── */
export interface FinanceState {
  entradas: Record<string, number>;
  obs: Record<string, string>;
  devendo: Record<string, number>;
  itens: DespesaItem[];
  compras: Compra[];
  nextId: number;
}

/* ── Item da lista de mercado ── */
export interface MktItem {
  id: number;
  cat: string;
  nome: string;
  qty: string;
  done: boolean;
  custom: boolean;
  comprado: number;
}

/* ── Estado do mercado ── */
export interface MktState {
  list: MktItem[];
  nextId: number;
}

/* ── Forma de pagamento ── */
export interface FormaPagamento {
  readonly val: string;
  readonly lab: string;
}

/* ── Categoria do mercado ── */
export interface MktCategory {
  readonly cat: string;
  readonly tip?: string;
  readonly items: ReadonlyArray<{ readonly n: string; readonly q: string }>;
}

/* ── Zod Schemas para validação ── */
export const CompraSchema = z.object({
  loja: z.string().min(1, "Nome do mercado é obrigatório").max(200),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  valor: z.number().positive("Valor deve ser maior que zero"),
  imgB64: z.string().nullable().optional(),
  aiItems: z.array(z.string()).optional().default([]),
});

export const DespesaSchema = z.object({
  nome: z.string().min(1).max(200),
  valor: z.number().min(0),
  icon: z.string().max(10),
});

export const EntradaSchema = z.object({
  nome: z.string().min(1),
  valor: z.number().min(0).max(1_000_000),
});

/* ── Resumo financeiro ── */
export interface FinanceSummary {
  fundoTotal: number;
  totalContas: number;
  totalMercado: number;
  totalSaidas: number;
  saldoFundo: number;
  partePorPessoa: number;
}
