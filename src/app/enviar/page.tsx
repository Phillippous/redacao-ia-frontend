"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const router = useRouter();
  const pathname = usePathname();

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 400 : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 400);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <nav
      aria-label="Navegação principal"
      style={{
        position: "sticky", top: 0, zIndex: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "14px 16px" : "16px 24px",
        borderBottom: `1px solid ${C.cardBorder}`,
        background: `${C.bg}E8`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <Link href="/enviar" style={{ display: "inline-flex", alignItems: "baseline", gap: 1, textDecoration: "none" }}>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 20, color: C.text, letterSpacing: "-0.025em", lineHeight: 1 }}>nota</span>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, marginBottom: 2, flexShrink: 0 }} />
      </Link>

      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {[
          { href: "/enviar", label: "Escrever" },
          { href: "/historico", label: "Histórico" },
        ].map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              style={{
                borderRadius: 10,
                padding: isMobile ? "10px 8px" : "10px 16px",
                minHeight: 44,
                display: "inline-flex", alignItems: "center",
                fontSize: isMobile ? 12 : 13, fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif", textDecoration: "none",
                transition: "all 0.2s ease",
                background: isActive ? C.accentDim : "transparent",
                border: `1px solid ${isActive ? "rgba(45,212,168,0.20)" : "transparent"}`,
                color: isActive ? C.accent : C.textMuted,
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = C.text; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = C.textMuted; }}
            >
              {item.label}
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          style={{
            background: "none", border: "none",
            color: C.textDim, fontSize: 12,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            padding: isMobile ? "10px 4px" : "10px 8px", minHeight: 44,
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.textMuted)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.textDim)}
        >
          Sair
        </button>
      </div>
    </nav>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EnviarPage() {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [tema, setTema] = useState("");
  const [essayText, setEssayText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 400 : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 400);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
  const lineCount = essayText ? essayText.split("\n").length : 0;
  const charCount = essayText.length;

  const canSubmit = essayText.trim().length > 0 && tema.trim().length > 0;

  async function handleSubmit() {
    if (!canSubmit || isSubmitting) return;
    setError(null);
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ tema, redacao: essayText }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao enviar redação.");
      }

      const data = await res.json();
      if (!data.submission_id) {
        throw new Error('Redação corrigida, mas não foi possível salvar. Tente novamente.');
      }
      router.push(`/resultado/${data.submission_id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado. Tente novamente.");
      setIsSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    background: C.surface,
    border: `1px solid ${C.cardBorder}`,
    borderRadius: 12,
    padding: "14px 16px",
    color: C.text,
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 500,
    color: C.textMuted,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <Nav />

      <main style={{ maxWidth: 640, margin: "0 auto", padding: isMobile ? "24px 16px 48px" : "32px 24px 64px" }}>
        <h1 style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 600,
          color: C.text, marginBottom: 6, letterSpacing: "-0.01em",
        }}>
          Nova redação
        </h1>
        <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 28px" }}>
          Cole ou digite sua redação abaixo. A correção leva cerca de 30 segundos.
        </p>

        {/* Tema */}
        <div style={{ marginBottom: 20 }}>
          <label htmlFor="tema-input" style={labelStyle}>
            Tema da redação{" "}
            <span style={{ color: C.errorText, fontSize: 10, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
              (obrigatório)
            </span>
          </label>
          <input
            id="tema-input"
            type="text"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            placeholder="Ex: A invisibilidade do trabalho de cuidado realizado pela mulher no Brasil"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(45,212,168,0.40)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = C.cardBorder)}
          />
        </div>

        {/* Redação */}
        <div style={{ marginBottom: 20 }}>
          <label htmlFor="essay-input" style={labelStyle}>
            Sua redação{" "}
            <span style={{ color: C.errorText, fontSize: 10, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
              (obrigatório)
            </span>
          </label>
          <div style={{ position: "relative" }}>
            <textarea
              id="essay-input"
              ref={textareaRef}
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              placeholder="Cole ou digite sua redação aqui..."
              rows={16}
              style={{
                ...inputStyle,
                lineHeight: 1.8,
                resize: "vertical",
                paddingBottom: 36,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(45,212,168,0.40)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.cardBorder)}
            />
            {/* Contadores */}
            <div style={{
              position: "absolute", bottom: 12, right: 16,
              display: "flex", gap: isMobile ? 8 : 16,
              fontSize: 11, color: C.textDim,
              pointerEvents: "none",
            }}>
              <span>{wordCount} palavras</span>
              {!isMobile && <span>{lineCount} linhas</span>}
              <span>{charCount} car.</span>
            </div>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div
            role="alert"
            style={{
              fontSize: 13, color: C.errorText,
              marginBottom: 16, padding: "10px 14px",
              background: C.errorBg,
              border: `1px solid ${C.errorBorder}`,
              borderRadius: 8,
            }}
          >
            {error}
          </div>
        )}

        {/* Botão */}
        <div aria-live="polite" aria-atomic="true">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            aria-busy={isSubmitting}
            style={{
              width: "100%",
              background: !canSubmit ? C.surface : C.accent,
              border: `1px solid ${!canSubmit ? C.cardBorder : "transparent"}`,
              borderRadius: 12, padding: "15px", minHeight: 48,
              color: !canSubmit ? C.textDim : C.bg,
              fontSize: 15, fontWeight: 600,
              cursor: !canSubmit || isSubmitting ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.3s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}
            onMouseEnter={(e) => { if (canSubmit && !isSubmitting) e.currentTarget.style.background = C.accentHover; }}
            onMouseLeave={(e) => { if (canSubmit && !isSubmitting) e.currentTarget.style.background = C.accent; }}
          >
            {isSubmitting ? (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: "spin 0.8s linear infinite" }} aria-hidden="true">
                  <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(6,6,11,0.3)" strokeWidth="2" />
                  <path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke={C.bg} strokeWidth="2" strokeLinecap="round" />
                </svg>
                Corrigindo sua redação...
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </>
            ) : (
              "Enviar para correção"
            )}
          </button>
        </div>

        {!canSubmit && !isSubmitting && (
          <p style={{ fontSize: 12, color: C.textDim, textAlign: "center", marginTop: 10 }}>
            Preencha o tema e a redação para enviar.
          </p>
        )}
      </main>
    </div>
  );
}
