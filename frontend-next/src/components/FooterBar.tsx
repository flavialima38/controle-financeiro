"use client";

interface Props {
  onReset: () => void;
  onResumoPDF: () => void;
  onSalvar: () => void;
}

export default function FooterBar({ onReset, onResumoPDF, onSalvar }: Props) {
  return (
    <div className="fbar">
      <button className="bs" onClick={onReset}>↺ Limpar</button>
      <button className="bpdf" onClick={onResumoPDF}>📄 Resumo</button>
      <button className="bp" onClick={onSalvar}>💾 Salvar</button>
    </div>
  );
}
