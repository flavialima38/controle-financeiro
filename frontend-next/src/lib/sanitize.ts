/**
 * Módulo de sanitização anti-XSS.
 * Usa DOMPurify para limpar todo input de usuário.
 */
import DOMPurify from "dompurify";

/**
 * Sanitiza uma string removendo qualquer HTML/JS malicioso.
 */
export function sanitize(dirty: string): string {
  if (typeof window === "undefined") return dirty;
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Sanitiza um valor numérico — garante que é um número finito e não-negativo.
 */
export function sanitizeNumber(value: unknown): number {
  const num = typeof value === "string" ? parseFloat(value.replace(/[^\d.,\-]/g, "").replace(",", ".")) : Number(value);
  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.round(num * 100) / 100; // Máximo 2 casas decimais
}

/**
 * Escapa caracteres especiais para uso seguro em atributos HTML.
 */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return str.replace(/[&<>"']/g, (m) => map[m] || m);
}

/**
 * Valida se uma string parece uma data ISO válida (YYYY-MM-DD).
 */
export function isValidDate(dateStr: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) && !isNaN(Date.parse(dateStr));
}

/**
 * Limita o tamanho de uma string para prevenir abuse.
 */
export function truncate(str: string, maxLen: number = 500): string {
  return str.length > maxLen ? str.slice(0, maxLen) : str;
}
