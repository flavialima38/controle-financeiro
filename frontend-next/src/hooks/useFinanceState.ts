"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { FinanceState, MktState, MktItem } from "../lib/types";
import { emptyState, newItem } from "../lib/finance";
import { DESPESA_ICONS, MKT_DEFAULT } from "../lib/constants";
import { financeApi, marketApi } from "../lib/api";
import { sanitize, sanitizeNumber } from "../lib/sanitize";

function stKey(yr: number, mi: number) { return `cfcasa_${yr}_${mi}`; }
function mktKey(yr: number, mi: number) { return `mkt_${yr}_${mi}`; }

function defaultMktList(): MktState {
  let id = 1;
  const list: MktItem[] = [];
  MKT_DEFAULT.forEach(cat => {
    cat.items.forEach(it => {
      list.push({ id: id++, cat: cat.cat, nome: it.n, qty: it.q, done: false, custom: false, comprado: 0 });
    });
  });
  return { list, nextId: id };
}

function loadLocal<T>(key: string, fallback: () => T): T {
  if (typeof window === "undefined") return fallback();
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch { /* corrupted data */ }
  return fallback();
}

function saveLocal(key: string, data: unknown) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* quota exceeded */ }
}

/* ── Hook principal ── */
export function useFinanceState() {
  const [yr, setYr] = useState(() => new Date().getFullYear());
  const [mi, setMi] = useState(() => new Date().getMonth());
  const [state, setState] = useState<FinanceState>(() => emptyState());
  const [mktState, setMktState] = useState<MktState>(() => defaultMktList());
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  /* Carrega estado ao mudar mês */
  useEffect(() => {
    const loaded = loadLocal<FinanceState>(stKey(yr, mi), emptyState);
    if (!loaded.obs) loaded.obs = {};
    if (!loaded.devendo) loaded.devendo = {};
    if (!loaded.compras) loaded.compras = [];
    setState(loaded);
    // Tenta sincronizar do backend
    financeApi.get(yr, mi).then(data => {
      if (data && typeof data === "object" && "entradas" in (data as Record<string, unknown>)) {
        const apiState = data as FinanceState;
        setState(apiState);
        saveLocal(stKey(yr, mi), apiState);
      }
    });
  }, [yr, mi]);

  /* Salva com debounce (anti-flood) */
  const save = useCallback((newState: FinanceState) => {
    setState(newState);
    saveLocal(stKey(yr, mi), newState);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      financeApi.save(yr, mi, newState);
    }, 800);
  }, [yr, mi]);

  /* Navegar meses */
  const changeMonth = useCallback((dir: number) => {
    setMi(prev => {
      let m = prev + dir;
      if (m < 0) { setYr(y => y - 1); m = 11; }
      if (m > 11) { setYr(y => y + 1); m = 0; }
      return m;
    });
  }, []);

  /* ── Ações sobre despesas ── */
  const editItem = useCallback((id: number, field: keyof typeof state.itens[0], value: unknown) => {
    setState(prev => {
      const next = { ...prev, itens: prev.itens.map(it => {
        if (it.id !== id) return it;
        if (field === "nome") return { ...it, nome: sanitize(String(value)) };
        if (field === "valor") return { ...it, valor: sanitizeNumber(value) };
        if (field === "forma") return { ...it, forma: sanitize(String(value)) };
        if (field === "dataPgto") return { ...it, dataPgto: String(value) };
        if (field === "status") return { ...it, status: it.status === "pago" ? "pendente" as const : "pago" as const };
        if (field === "comprovante") return { ...it, comprovante: String(value) };
        return it;
      })};
      save(next);
      return next;
    });
  }, [save]);

  const addItem = useCallback(() => {
    setState(prev => {
      const icon = DESPESA_ICONS[Math.floor(Math.random() * DESPESA_ICONS.length)];
      const item = newItem(prev.nextId, icon, "Nova despesa", 0);
      const next = { ...prev, itens: [...prev.itens, item], nextId: prev.nextId + 1 };
      save(next);
      return next;
    });
  }, [save]);

  const removeItem = useCallback((id: number) => {
    setState(prev => {
      const next = { ...prev, itens: prev.itens.filter(it => it.id !== id) };
      save(next);
      return next;
    });
  }, [save]);

  /* ── Ações sobre entradas ── */
  const editEntrada = useCallback((nome: string, valor: number) => {
    setState(prev => {
      const next = { ...prev, entradas: { ...prev.entradas, [nome]: sanitizeNumber(valor) } };
      save(next);
      return next;
    });
  }, [save]);

  const editObs = useCallback((nome: string, texto: string) => {
    setState(prev => {
      const next = { ...prev, obs: { ...prev.obs, [nome]: sanitize(texto) } };
      save(next);
      return next;
    });
  }, [save]);

  const editDevendo = useCallback((nome: string, valor: number) => {
    setState(prev => {
      const next = { ...prev, devendo: { ...prev.devendo, [nome]: sanitizeNumber(valor) } };
      save(next);
      return next;
    });
  }, [save]);

  /* ── Compras ── */
  const addCompra = useCallback((compra: FinanceState["compras"][0]) => {
    setState(prev => {
      const next = { ...prev, compras: [...(prev.compras || []), compra] };
      save(next);
      return next;
    });
  }, [save]);

  const removeCompra = useCallback((idx: number) => {
    setState(prev => {
      const compras = [...(prev.compras || [])];
      compras.splice(idx, 1);
      const next = { ...prev, compras };
      save(next);
      return next;
    });
  }, [save]);

  /* ── Mercado ── */
  const loadMkt = useCallback(() => {
    const loaded = loadLocal<MktState>(mktKey(yr, mi), defaultMktList);
    setMktState(loaded);
    // Sincroniza do backend
    marketApi.get(yr, mi).then(data => {
      if (data && typeof data === "object" && "list" in (data as Record<string, unknown>)) {
        const apiState = data as MktState;
        setMktState(apiState);
        saveLocal(mktKey(yr, mi), apiState);
      }
    });
    return loaded;
  }, [yr, mi]);

  const saveMkt = useCallback((ms: MktState) => {
    setMktState(ms);
    saveLocal(mktKey(yr, mi), ms);
    marketApi.save(yr, mi, ms);
  }, [yr, mi]);

  const toggleMktItem = useCallback((id: number) => {
    setMktState(prev => {
      const next = { ...prev, list: prev.list.map(it => it.id === id ? { ...it, done: !it.done } : it) };
      saveMkt(next);
      return next;
    });
  }, [saveMkt]);

  const editMktBought = useCallback((id: number, qty: number) => {
    setMktState(prev => {
      const next = { ...prev, list: prev.list.map(it => {
        if (it.id !== id) return it;
        const comprado = Math.max(0, Math.round(qty));
        const needed = parseInt(it.qty.match(/(\d+)/)?.[1] || "0");
        const done = needed > 0 && comprado >= needed;
        return { ...it, comprado, done: done || it.done };
      })};
      saveMkt(next);
      return next;
    });
  }, [saveMkt]);

  const addMktItem = useCallback((nome: string, qty: string) => {
    setMktState(prev => {
      const item: MktItem = {
        id: prev.nextId, cat: "✏️ Adicionados por você",
        nome: sanitize(nome), qty: sanitize(qty) || "—",
        done: false, custom: true, comprado: 0,
      };
      const next = { ...prev, list: [...prev.list, item], nextId: prev.nextId + 1 };
      saveMkt(next);
      return next;
    });
  }, [saveMkt]);

  const resetMkt = useCallback(() => {
    setMktState(prev => {
      const next = { ...prev, list: prev.list.map(it => ({ ...it, done: false, comprado: 0 })) };
      saveMkt(next);
      return next;
    });
  }, [saveMkt]);

  /* ── Reset mês ── */
  const resetMes = useCallback(() => {
    const empty = emptyState();
    setState(empty);
    save(empty);
    financeApi.reset(yr, mi);
  }, [yr, mi, save]);

  /* ── Salvar explícito ── */
  const salvarExplicito = useCallback(() => {
    saveLocal(stKey(yr, mi), state);
    financeApi.save(yr, mi, state);
  }, [yr, mi, state]);

  return {
    yr, mi, state, mktState,
    changeMonth, save,
    editItem, addItem, removeItem,
    editEntrada, editObs, editDevendo,
    addCompra, removeCompra,
    loadMkt, saveMkt, toggleMktItem, editMktBought, addMktItem, resetMkt,
    resetMes, salvarExplicito,
  };
}
