"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import GoogleSignInButton from "@/components/GoogleSignInButton";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#06060B",
  surface: "#0F0F18",
  card: "#12121E",
  cardBorder: "rgba(255,255,255,0.08)",
  text: "#E8E6E1",
  textMuted: "#8A8880",
  textDim: "#5C5A54",
  accent: "#2DD4A8",
  accentHover: "#3EEAB8",
  accentDim: "rgba(45,212,168,0.10)",
  errorBg: "rgba(232,90,74,0.08)",
  errorBorder: "rgba(232,90,74,0.20)",
  errorText: "#E85A4A",
};

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <Link href="/" aria-label="nota. — Voltar à página inicial" style={{ display: "inline-flex", alignItems: "baseline", gap: 1, textDecoration: "none" }}>
      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 28, color: C.text, letterSpacing: "-0.025em", lineHeight: 1 }}>
        nota
      </span>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent, marginBottom: 2, flexShrink: 0 }} />
    </Link>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav
      aria-label="Navegação principal"
      style={{
        position: "sticky", top: 0, zIndex: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 24px",
        borderBottom: `1px solid ${C.cardBorder}`,
        background: `${C.bg}E8`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <Link href="/" style={{ display: "inline-flex", alignItems: "baseline", gap: 1, textDecoration: "none" }}>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 20, color: C.text, letterSpacing: "-0.025em", lineHeight: 1 }}>nota</span>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, marginBottom: 2, flexShrink: 0 }} />
      </Link>
      <div style={{ display: "flex", gap: 6 }}>
        <Link
          href="/cadastro"
          style={{
            background: C.accentDim,
            border: `1px solid rgba(45,212,168,0.20)`,
            borderRadius: 10, padding: "10px 18px", minHeight: 44,
            display: "inline-flex", alignItems: "center",
            color: C.accent, fontSize: 13, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif", textDecoration: "none",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(45,212,168,0.16)";
            e.currentTarget.style.borderColor = "rgba(45,212,168,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = C.accentDim;
            e.currentTarget.style.borderColor = "rgba(45,212,168,0.20)";
          }}
        >
          Criar conta
        </Link>
      </div>
    </nav>
  );
}

// ─── Input style ──────────────────────────────────────────────────────────────
const inputBase: React.CSSProperties = {
  width: "100%",
  background: C.surface,
  border: `1px solid ${C.cardBorder}`,
  borderRadius: 12,
  padding: "14px 16px",
  color: C.text,
  fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s ease",
};

// ─── Label style ──────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 500,
  color: C.textMuted,
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError("Preencha email e senha.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError("Email ou senha incorretos.");
      return;
    }
    router.push("/enviar");
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <Nav />

      <main style={{ maxWidth: 420, margin: "0 auto", padding: "48px 24px 64px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Logo />
          <h1 style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 600,
            color: C.text, marginTop: 16, marginBottom: 6, letterSpacing: "-0.01em",
          }}>
            Bem-vindo de volta
          </h1>
          <p style={{ fontSize: 14, color: C.textMuted, margin: 0 }}>
            Entre na sua conta para continuar.
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: C.card,
          border: `1px solid ${C.cardBorder}`,
          borderRadius: 16, padding: "28px 24px",
        }}>
          
          {/* Google SSO */}
          <GoogleSignInButton label="Continuar com Google" />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: C.cardBorder }} />
            <span style={{ fontSize: 12, color: C.textDim, whiteSpace: "nowrap" }}>ou entre com email</span>
            <div style={{ flex: 1, height: 1, background: C.cardBorder }} />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="login-email" style={labelStyle}>Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="seu@email.com"
              autoComplete="email"
              style={inputBase}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(45,212,168,0.40)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.cardBorder)}
            />
          </div>

          {/* Senha */}
          <div style={{ marginBottom: 8 }}>
            <label htmlFor="login-password" style={labelStyle}>Senha</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Sua senha"
              autoComplete="current-password"
              style={inputBase}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(45,212,168,0.40)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.cardBorder)}
            />
          </div>

          {/* Esqueceu senha */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 22 }}>
            <button
              style={{
                background: "none", border: "none",
                color: C.textDim, fontSize: 12,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                padding: "4px 0", minHeight: 32,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.textMuted)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.textDim)}
            >
              Esqueceu a senha?
            </button>
          </div>

          {/* Erro */}
          {error && (
            <div
              role="alert"
              style={{
                fontSize: 13, color: C.errorText, marginBottom: 16,
                padding: "10px 14px",
                background: C.errorBg,
                border: `1px solid ${C.errorBorder}`,
                borderRadius: 8,
              }}
            >
              {error}
            </div>
          )}

          {/* Botão */}
          <button
            onClick={handleLogin}
            disabled={loading}
            aria-busy={loading}
            style={{
              width: "100%",
              background: loading ? C.surface : C.accent,
              border: loading ? `1px solid ${C.cardBorder}` : "none",
              borderRadius: 12, padding: "14px", minHeight: 48,
              color: loading ? C.textDim : C.bg,
              fontSize: 15, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = C.accentHover; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = C.accent; }}
          >
            {loading ? (
              <>
                <svg
                  width="16" height="16" viewBox="0 0 16 16"
                  style={{ animation: "spin 0.8s linear infinite" }}
                  aria-hidden="true"
                >
                  <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(232,230,225,0.3)" strokeWidth="2" />
                  <path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" />
                </svg>
                Entrando...
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </div>

        {/* Link cadastro */}
        <p style={{ fontSize: 13, color: C.textDim, textAlign: "center", marginTop: 20 }}>
          Não tem conta?{" "}
          <Link
            href="/cadastro"
            style={{ color: C.accent, fontSize: 13, fontWeight: 500, textDecoration: "underline", textUnderlineOffset: 3 }}
          >
            Criar conta gratuita
          </Link>
        </p>
      </main>
    </div>
  );
}
