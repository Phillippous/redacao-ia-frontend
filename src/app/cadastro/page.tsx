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
  successBg: "rgba(45,212,168,0.08)",
  successBorder: "rgba(45,212,168,0.20)",
};

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

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 500,
  color: C.textMuted,
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

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
      <Link
        href="/login"
        style={{
          background: "transparent", border: "none", borderRadius: 10,
          padding: "10px 18px", minHeight: 44,
          display: "inline-flex", alignItems: "center",
          color: C.textMuted, fontSize: 13, fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif", textDecoration: "none",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
        onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
      >
        Entrar
      </Link>
    </nav>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CadastroPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [lgpdAccepted, setLgpdAccepted] = useState(false);
  const [confirmedAge, setConfirmedAge] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Preencha email e senha.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (!lgpdAccepted) {
      setError("Você precisa aceitar os Termos de Uso e a Política de Privacidade.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setSuccess(true);
  }

  // ─── Success state ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
        <Nav />
        <main style={{ maxWidth: 420, margin: "0 auto", padding: "48px 24px 64px", textAlign: "center" }}>
          <div style={{
            background: C.card,
            border: `1px solid ${C.cardBorder}`,
            borderRadius: 16, padding: "40px 28px",
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "rgba(45,212,168,0.12)",
              border: "1px solid rgba(45,212,168,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: 24,
            }}>
              ✓
            </div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 600, color: C.text, marginBottom: 10, letterSpacing: "-0.01em" }}>
              Cadastro realizado!
            </h1>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.65, marginBottom: 0 }}>
              Verifique seu email para confirmar sua conta antes de entrar.
            </p>
          </div>
          <p style={{ fontSize: 13, color: C.textDim, marginTop: 20 }}>
            Já confirmou?{" "}
            <Link href="/login" style={{ color: C.accent, textDecoration: "underline", textUnderlineOffset: 3 }}>
              Entrar
            </Link>
          </p>
        </main>
      </div>
    );
  }

  // ─── Form ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <Nav />

      <main style={{ maxWidth: 420, margin: "0 auto", padding: "48px 24px 64px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "baseline", gap: 1, textDecoration: "none" }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 28, color: C.text, letterSpacing: "-0.025em", lineHeight: 1 }}>nota</span>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent, marginBottom: 2, flexShrink: 0 }} />
          </Link>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 600,
            color: C.text, marginTop: 16, marginBottom: 6, letterSpacing: "-0.01em",
          }}>
            Crie sua conta
          </h1>
          <p style={{ fontSize: 14, color: C.textMuted, margin: 0 }}>
            Gratuito durante o beta. Sem cartão de crédito.
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
            <span style={{ fontSize: 12, color: C.textDim, whiteSpace: "nowrap" }}>ou cadastre com email</span>
            <div style={{ flex: 1, height: 1, background: C.cardBorder }} />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="signup-email" style={labelStyle}>Email</label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              style={inputBase}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(45,212,168,0.40)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.cardBorder)}
            />
          </div>

          {/* Senha */}
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="signup-password" style={labelStyle}>Senha</label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              style={inputBase}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(45,212,168,0.40)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.cardBorder)}
            />
          </div>

          {/* Confirmar senha */}
          <div style={{ marginBottom: 22 }}>
            <label htmlFor="signup-confirm" style={labelStyle}>Confirmar senha</label>
            <input
              id="signup-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Repita sua senha"
              autoComplete="new-password"
              style={inputBase}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(45,212,168,0.40)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.cardBorder)}
            />
          </div>

          {/* LGPD */}
          <div style={{
            background: C.surface,
            border: `1px solid ${C.cardBorder}`,
            borderRadius: 10, padding: "14px 16px",
            marginBottom: 14,
          }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={lgpdAccepted}
                onChange={(e) => setLgpdAccepted(e.target.checked)}
                aria-required="true"
                style={{ marginTop: 2, accentColor: C.accent, width: 16, height: 16, flexShrink: 0, cursor: "pointer" }}
              />
              <span style={{ fontSize: 13, lineHeight: 1.65, color: C.textMuted }}>
                Li e aceito os{" "}
                <Link href="/termos" style={{ color: C.accent, textDecoration: "underline", textUnderlineOffset: 2 }}>
                  Termos de Uso
                </Link>
                {" "}e a{" "}
                <Link href="/privacidade" style={{ color: C.accent, textDecoration: "underline", textUnderlineOffset: 2 }}>
                  Política de Privacidade
                </Link>
                . Autorizo o tratamento dos meus dados conforme a LGPD para a prestação do serviço.
              </span>
            </label>
          </div>

          {/* Confirmação de idade */}
          <div style={{
            background: C.surface,
            border: `1px solid ${C.cardBorder}`,
            borderRadius: 10, padding: "14px 16px",
            marginBottom: 22,
          }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={confirmedAge}
                onChange={(e) => setConfirmedAge(e.target.checked)}
                style={{ marginTop: 2, accentColor: C.accent, width: 16, height: 16, flexShrink: 0, cursor: "pointer" }}
              />
              <span style={{ fontSize: 13, lineHeight: 1.65, color: C.textMuted }}>
                Confirmo que tenho 13 anos ou mais, ou que tenho autorização de um responsável legal.
              </span>
            </label>
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
            onClick={handleSubmit}
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
                <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: "spin 0.8s linear infinite" }} aria-hidden="true">
                  <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(232,230,225,0.3)" strokeWidth="2" />
                  <path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" />
                </svg>
                Criando conta...
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </>
            ) : (
              "Criar conta"
            )}
          </button>
        </div>

        {/* Link login */}
        <p style={{ fontSize: 13, color: C.textDim, textAlign: "center", marginTop: 20 }}>
          Já tem conta?{" "}
          <Link href="/login" style={{ color: C.accent, fontSize: 13, fontWeight: 500, textDecoration: "underline", textUnderlineOffset: 3 }}>
            Entrar
          </Link>
        </p>
      </main>
    </div>
  );
}
