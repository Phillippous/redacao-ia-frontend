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
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const IMAGE_ERROR = "Há um erro na imagem anexada";
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

  async function handleImageUpload(file: File | undefined | null) {
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_BYTES) {
      setError(IMAGE_ERROR);
      return;
    }

    // Se já há texto digitado, confirma antes de sobrescrever
    if (essayText.trim().length > 0) {
      const confirmed = window.confirm(
        "Isso vai substituir o texto atual pelo texto extraído da foto. Deseja continuar?"
      );
      if (!confirmed) return;
    }

    setError(null);
    setIsOcrLoading(true);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ocr`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${session.access_token}` },
        body: formData,
      });

      if (!res.ok) {
        setError(IMAGE_ERROR);
        return;
      }

      const data = await res.json();
      if (!data.redacao || typeof data.redacao !== "string") {
        setError(IMAGE_ERROR);
        return;
      }

      setEssayText(data.redacao);
      setAttachedFileName(file.name);
    } catch {
      setError(IMAGE_ERROR);
    } finally {
      setIsOcrLoading(false);
    }
  }

  // Remove apenas o chip (preserva o texto já extraído/editado)
  function handleRemoveAttachment() {
    setAttachedFileName(null);
  }

  // Intercepta paste de imagem no textarea; deixa o paste de texto rolar normal
  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          handleImageUpload(file);
          return;
        }
      }
    }
  }

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
          Cole, digite ou anexe uma foto da sua redação. A correção leva cerca de 30 segundos.
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

        {/* Redação (campo unificado: texto + foto) */}
        <div style={{ marginBottom: 20 }}>
          <label htmlFor="essay-input" style={labelStyle}>
            Sua redação{" "}
            <span style={{ color: C.errorText, fontSize: 10, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
              (obrigatório)
            </span>
          </label>

          {/* Chip de anexo — aparece quando OCR foi bem-sucedido */}
          {attachedFileName && !isOcrLoading && (
            <div
              role="status"
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px",
                background: C.accentDim,
                border: `1px solid rgba(45,212,168,0.20)`,
                borderRadius: 10,
                marginBottom: 8,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                <path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z" stroke={C.accent} strokeWidth="1.5" />
                <circle cx="6" cy="6" r="1.25" fill={C.accent} />
                <path d="m2.5 11 3-3 3.5 3.5 2-2 2.5 2.5" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13, color: C.text, fontWeight: 500,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  Texto extraído de {attachedFileName}
                </div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                  Revise com atenção — o OCR pode cometer erros.
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveAttachment}
                aria-label="Remover indicação de foto anexada"
                style={{
                  background: "none", border: "none",
                  color: C.textMuted, fontSize: 16, lineHeight: 1,
                  cursor: "pointer", padding: 4,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  minWidth: 28, minHeight: 28,
                  borderRadius: 6,
                  transition: "color 0.2s ease",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
              >
                ✕
              </button>
            </div>
          )}

          <div
            style={{ position: "relative" }}
            onDragEnter={(e) => {
              e.preventDefault(); e.stopPropagation();
              if (!isOcrLoading) setIsDragging(true);
            }}
            onDragOver={(e) => {
              e.preventDefault(); e.stopPropagation();
              if (!isOcrLoading) setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault(); e.stopPropagation();
              // Só desativa o drag se realmente saiu do wrapper (não só entrou num filho)
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setIsDragging(false);
              }
            }}
            onDrop={(e) => {
              e.preventDefault(); e.stopPropagation();
              setIsDragging(false);
              if (isOcrLoading) return;
              handleImageUpload(e.dataTransfer.files?.[0]);
            }}
          >
            <textarea
              id="essay-input"
              ref={textareaRef}
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              onPaste={handlePaste}
              disabled={isOcrLoading}
              placeholder="Cole, digite ou arraste uma foto da sua redação aqui..."
              rows={16}
              style={{
                ...inputStyle,
                lineHeight: 1.8,
                resize: "vertical",
                paddingBottom: 36,
                borderColor: isDragging ? C.accent : C.cardBorder,
                opacity: isOcrLoading ? 0.5 : 1,
              }}
              onFocus={(e) => {
                if (!isDragging) e.currentTarget.style.borderColor = "rgba(45,212,168,0.40)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = isDragging ? C.accent : C.cardBorder;
              }}
            />

            {/* Overlay durante drag */}
            {isDragging && !isOcrLoading && (
              <div style={{
                position: "absolute", inset: 0,
                background: C.accentDim,
                border: `2px dashed ${C.accent}`,
                borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: C.accent, fontSize: 14, fontWeight: 500,
                pointerEvents: "none",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Solte a imagem para extrair o texto
              </div>
            )}

            {/* Overlay durante OCR */}
            {isOcrLoading && (
              <div
                role="status"
                aria-live="polite"
                style={{
                  position: "absolute", inset: 0,
                  background: "rgba(15,15,24,0.75)",
                  borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 10,
                  color: C.accent, fontSize: 13, fontWeight: 500,
                  pointerEvents: "none",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: "spin 0.8s linear infinite" }} aria-hidden="true">
                  <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                  <path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>Extraindo texto da imagem...</span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

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

          {/* Link sutil para anexar foto + dica de formato */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginTop: 8, gap: 12, flexWrap: "wrap",
          }}>
            <button
              type="button"
              onClick={() => { if (!isOcrLoading) fileInputRef.current?.click(); }}
              disabled={isOcrLoading}
              style={{
                background: "none", border: "none",
                color: C.textMuted, fontSize: 12,
                cursor: isOcrLoading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                padding: "4px 0",
                textAlign: "left",
                display: "inline-flex", alignItems: "center", gap: 6,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => { if (!isOcrLoading) e.currentTarget.style.color = C.accent; }}
              onMouseLeave={(e) => { if (!isOcrLoading) e.currentTarget.style.color = C.textMuted; }}
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="6" cy="6" r="1.25" fill="currentColor" />
                <path d="m2.5 11 3-3 3.5 3.5 2-2 2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              ou anexe uma foto
            </button>
            <span style={{ fontSize: 11, color: C.textDim }}>
              JPG, PNG ou WEBP • até 5MB
            </span>
          </div>

          {/* Input file oculto (acionado pelo link, paste ou drop) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={(e) => {
              handleImageUpload(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
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