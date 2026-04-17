"use client";

import { useState, useRef } from "react";
import { parseValor } from "@/lib/finance";
import { sanitize, sanitizeNumber } from "@/lib/sanitize";
import { CompraSchema } from "@/lib/types";
import type { Compra } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (compra: Compra) => void;
}

export default function ModalCompras({ open, onClose, onSave }: Props) {
  const [loja, setLoja] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [valor, setValor] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [fileB64, setFileB64] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validação de segurança: só aceita imagens e PDF
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
    if (!allowed.includes(file.type)) {
      alert("Tipo de arquivo não permitido. Use JPG, PNG ou PDF.");
      return;
    }
    // Limite de 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert("Arquivo muito grande. Máximo 10MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      const b64 = ev.target?.result as string;
      setFileB64(b64);
      if (file.type.startsWith("image/")) setPreview(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const parsed = CompraSchema.safeParse({
      loja: sanitize(loja.trim()),
      data,
      valor: sanitizeNumber(parseValor(valor)),
      imgB64: fileB64,
      aiItems: [],
    });

    if (!parsed.success) {
      alert(parsed.error.issues.map(i => i.message).join("\n"));
      return;
    }

    onSave(parsed.data as Compra);
    // Reset form
    setLoja(""); setValor(""); setPreview(null); setFileB64(null);
    if (fileRef.current) fileRef.current.value = "";
    onClose();
  };

  if (!open) return null;

  return (
    <div className="overlay open">
      <div className="modal">
        <div className="mhdr">
          <h2>🧾 Registrar Compra</h2>
          <button className="mclose" onClick={onClose}>✕</button>
        </div>
        <div className="mscroll">
          <div className="frow">
            <label>Nome do Mercado / Loja</label>
            <input className="finput" type="text" placeholder="Ex: Supermercado Mendonça"
              value={loja} onChange={e => setLoja(e.target.value)} maxLength={200} />
          </div>
          <div className="frow">
            <label>Data da Compra</label>
            <input className="finput" type="date" value={data} onChange={e => setData(e.target.value)} />
          </div>
          <div className="frow">
            <label>Valor Total (R$)</label>
            <div className="vi" style={{ width: "100%", borderRadius: 9, padding: "8px 12px" }}>
              <em style={{ fontSize: ".82rem" }}>R$</em>
              <input type="text" inputMode="decimal" placeholder="0,00"
                value={valor} onChange={e => setValor(e.target.value)}
                style={{ width: "100%", fontSize: "1rem" }} />
            </div>
          </div>
          <div className="frow">
            <label>Nota Fiscal / Comprovante</label>
            <div className="upload-area">
              <input type="file" ref={fileRef} accept="image/*,application/pdf" onChange={handleFile} />
              <div className="upload-icon">📷</div>
              <div className="upload-txt">Toque para tirar foto ou escolher arquivo<br /><strong>JPG, PNG ou PDF</strong></div>
            </div>
            {preview && <img src={preview} className="upload-preview" alt="Preview" style={{ display: "block" }} />}
          </div>
        </div>
        <div className="mfoot">
          <button className="mbtn" onClick={handleSave}>✓ Salvar Compra</button>
        </div>
      </div>
    </div>
  );
}
