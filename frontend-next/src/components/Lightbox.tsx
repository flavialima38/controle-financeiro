"use client";

interface Props {
  src: string | null;
  onClose: () => void;
}

export default function Lightbox({ src, onClose }: Props) {
  if (!src) return null;
  return (
    <div className="lightbox open" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>✕</button>
      <img src={src} alt="Visualização" />
    </div>
  );
}
