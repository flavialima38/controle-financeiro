"use client";
/**
 * Página de Login — Controle Financeiro de Casa.
 * Autenticação via Supabase Auth com email e senha.
 */
import { useState, type FormEvent, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const MORADORES = [
  { nome: "Flavia", ini: "FL", cor: "#6c8fff" },
  { nome: "Igor",   ini: "IG", cor: "#ff7eb3" },
  { nome: "Luli",   ini: "LU", cor: "#4ade80" },
  { nome: "Daniel", ini: "DN", cor: "#fbbf24" },
  { nome: "Filipe", ini: "FP", cor: "#a78bfa" },
];

function avatarStyle(cor: string): CSSProperties {
  return {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: `${cor}22`,
    border: `2px solid ${cor}55`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: 700,
    color: cor,
    letterSpacing: "0.02em",
    flexShrink: 0,
  };
}

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: loginError } = await signIn(email, password);

    if (loginError) {
      if (loginError.includes("Invalid login") || loginError.includes("invalid_credentials")) {
        setError("Email ou senha incorretos. Tente novamente.");
      } else if (loginError.includes("Email not confirmed")) {
        setError("Confirme seu email antes de fazer login.");
      } else if (loginError.includes("Too many requests")) {
        setError("Muitas tentativas. Aguarde alguns minutos.");
      } else {
        setError(loginError);
      }
      setLoading(false);
      return;
    }

    router.push("/");
  }

  const page: CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0a0f1e 0%, #131929 50%, #0d1528 100%)",
    padding: "1rem",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
  };

  const glow1: CSSProperties = {
    position: "absolute",
    top: "-20%",
    left: "-10%",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(108,143,255,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  };

  const glow2: CSSProperties = {
    position: "absolute",
    bottom: "-20%",
    right: "-10%",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)",
    pointerEvents: "none",
  };

  const card: CSSProperties = {
    background: "rgba(20, 28, 48, 0.85)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(108,143,255,0.15)",
    borderRadius: "1.75rem",
    padding: "2.5rem 2.25rem",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
    position: "relative",
    zIndex: 1,
  };

  const iconWrap: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "72px",
    height: "72px",
    borderRadius: "1.25rem",
    background: "linear-gradient(135deg, rgba(108,143,255,0.2), rgba(167,139,250,0.2))",
    border: "1px solid rgba(108,143,255,0.3)",
    fontSize: "2.25rem",
    marginBottom: "1rem",
  };

  const title: CSSProperties = {
    fontSize: "1.6rem",
    fontWeight: 800,
    color: "#f1f5f9",
    margin: "0 0 0.25rem",
    fontFamily: "'Syne', sans-serif",
    letterSpacing: "-0.02em",
  };

  const subtitle: CSSProperties = {
    color: "#64748b",
    fontSize: "0.9rem",
    margin: 0,
  };

  const avatarsRow: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    marginBottom: "1.75rem",
  };

  const form: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const errorBox: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.25)",
    color: "#fca5a5",
    padding: "0.75rem 1rem",
    borderRadius: "0.875rem",
    fontSize: "0.875rem",
  };

  const fieldWrap: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  };

  const label: CSSProperties = {
    color: "#94a3b8",
    fontSize: "0.8125rem",
    fontWeight: 600,
    letterSpacing: "0.03em",
    textTransform: "uppercase",
  };

  const inputBase: CSSProperties = {
    width: "100%",
    background: "rgba(10,16,36,0.7)",
    border: "1px solid rgba(108,143,255,0.2)",
    borderRadius: "0.875rem",
    padding: "0.875rem 1rem",
    color: "#f1f5f9",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
  };

  const inputPass: CSSProperties = {
    ...inputBase,
    paddingRight: "3rem",
  };

  const inputWrap: CSSProperties = {
    position: "relative",
  };

  const eyeBtn: CSSProperties = {
    position: "absolute",
    right: "0.875rem",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#475569",
    fontSize: "1.1rem",
    padding: "0.25rem",
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  };

  const btn: CSSProperties = {
    background: "linear-gradient(135deg, #6c8fff 0%, #818cf8 100%)",
    color: "white",
    border: "none",
    borderRadius: "0.875rem",
    padding: "0.9375rem",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.65 : 1,
    marginTop: "0.5rem",
    letterSpacing: "0.01em",
    boxShadow: "0 4px 16px rgba(108,143,255,0.35)",
    fontFamily: "'DM Sans', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  };

  const divider: CSSProperties = {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(108,143,255,0.2), transparent)",
    margin: "1.25rem 0",
  };

  const footerText: CSSProperties = {
    color: "#334155",
    fontSize: "0.8rem",
    textAlign: "center",
    margin: 0,
  };

  const spinner: CSSProperties = {
    display: "inline-block",
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    flexShrink: 0,
  };

  return (
    <div style={page}>
      {/* Glows decorativos */}
      <div style={glow1} />
      <div style={glow2} />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .lp-input:focus { border-color: #6c8fff !important; box-shadow: 0 0 0 3px rgba(108,143,255,0.18) !important; }
        .lp-input::placeholder { color: #334155; }
        .lp-btn:not(:disabled):hover { opacity: 0.88 !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(108,143,255,0.45) !important; }
        .lp-btn:not(:disabled):active { transform: translateY(0) !important; }
        .lp-btn { transition: opacity 0.2s, transform 0.1s, box-shadow 0.2s; }
      `}</style>

      <div style={card}>
        {/* Cabeçalho */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={iconWrap}>🏠</div>
          <h1 style={title}>Controle Financeiro</h1>
          <p style={subtitle}>Acesso exclusivo para moradores</p>
        </div>

        {/* Avatares dos moradores */}
        <div style={avatarsRow}>
          {MORADORES.map(p => (
            <div key={p.nome} style={avatarStyle(p.cor)} title={p.nome}>
              {p.ini}
            </div>
          ))}
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={form} noValidate>
          {error && (
            <div style={errorBox} role="alert">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div style={fieldWrap}>
            <label htmlFor="email" style={label}>Email</label>
            <input
              id="email"
              className="lp-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="email"
              autoFocus
              disabled={loading}
              style={inputBase}
            />
          </div>

          {/* Senha */}
          <div style={fieldWrap}>
            <label htmlFor="password" style={label}>Senha</label>
            <div style={inputWrap}>
              <input
                id="password"
                className="lp-input"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                minLength={6}
                disabled={loading}
                style={inputPass}
              />
              <button
                type="button"
                style={eyeBtn}
                onClick={() => setShowPass(v => !v)}
                aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                tabIndex={-1}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="lp-btn"
            disabled={loading}
            style={btn}
          >
            {loading && <span style={spinner} />}
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div style={divider} />

        <p style={footerText}>🔒 Dados protegidos com autenticação Supabase</p>
      </div>
    </div>
  );
}
