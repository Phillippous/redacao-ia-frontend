"use client";

import Link from "next/link";

// ─── Design tokens ──────────────────────────────────────────────────────────
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
};

// ─── Logo ────────────────────────────────────────────────────────────────────
function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = { sm: { font: 20, dot: 6 }, md: { font: 28, dot: 8 }, lg: { font: 52, dot: 13 } }[size];
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 1 }}>
      <span
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          fontSize: s.font,
          color: C.text,
          letterSpacing: "-0.025em",
          lineHeight: 1,
        }}
      >
        nota
      </span>
      <div
        style={{
          width: s.dot,
          height: s.dot,
          borderRadius: "50%",
          background: C.accent,
          marginBottom: size === "lg" ? 3 : 2,
          flexShrink: 0,
        }}
      />
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav
      aria-label="Navegação principal"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        borderBottom: `1px solid ${C.cardBorder}`,
        background: `${C.bg}E8`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <Logo size="sm" />
      <div style={{ display: "flex", gap: 6 }}>
        <Link
          href="/login"
          style={{
            background: "transparent",
            border: "none",
            borderRadius: 10,
            padding: "10px 18px",
            minHeight: 44,
            display: "inline-flex",
            alignItems: "center",
            color: C.textMuted,
            fontSize: 13,
            fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
        >
          Entrar
        </Link>
        <Link
          href="/cadastro"
          style={{
            background: C.accentDim,
            border: `1px solid rgba(45,212,168,0.20)`,
            borderRadius: 10,
            padding: "10px 18px",
            minHeight: 44,
            display: "inline-flex",
            alignItems: "center",
            color: C.accent,
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            textDecoration: "none",
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

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "5", label: "competências avaliadas" },
  { value: "~30s", label: "para correção" },
  { value: "C1–C5", label: "padrão INEP" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: "'DM Sans', -apple-system, sans-serif",
        margin: 0,
        padding: 0,
      }}
    >
      <Nav />

      <main
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 73px)",
          padding: "40px 24px",
          overflow: "hidden",
        }}
      >
        {/* Glow: teal */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "18%",
            left: "8%",
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(45,212,168,0.07) 0%, transparent 70%)`,
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        {/* Glow: amber */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "8%",
            right: "4%",
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(232,184,74,0.04) 0%, transparent 70%)`,
            filter: "blur(50px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            maxWidth: 560,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Logo grande */}
          <Logo size="lg" />

          {/* Tagline */}
          <p
            style={{
              fontSize: 18,
              color: C.textMuted,
              marginTop: 20,
              marginBottom: 0,
              lineHeight: 1.65,
              fontWeight: 400,
              maxWidth: 400,
            }}
          >
            Correção de redação ENEM por IA.
            <br />
            Nota por competência. Feedback em segundos.
          </p>

          {/* CTAs */}
          <div
            style={{
              marginTop: 40,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Link
              href="/cadastro"
              style={{
                background: C.accent,
                border: "none",
                borderRadius: 12,
                padding: "14px 40px",
                minHeight: 52,
                display: "inline-flex",
                alignItems: "center",
                color: C.bg,
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                textDecoration: "none",
                letterSpacing: "-0.01em",
                boxShadow: `0 0 48px rgba(45,212,168,0.22)`,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.accentHover;
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 0 60px rgba(45,212,168,0.32)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.accent;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 0 48px rgba(45,212,168,0.22)";
              }}
            >
              Começar agora — é grátis
            </Link>

            <Link
              href="/demo"
              style={{
                background: "transparent",
                border: `1px solid ${C.cardBorder}`,
                borderRadius: 12,
                padding: "12px 32px",
                minHeight: 44,
                display: "inline-flex",
                alignItems: "center",
                color: C.textMuted,
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                e.currentTarget.style.color = C.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.cardBorder;
                e.currentTarget.style.color = C.textMuted;
              }}
            >
              Ver exemplo de correção
            </Link>
          </div>

          {/* Stats */}
          <div
            style={{
              marginTop: 64,
              display: "flex",
              justifyContent: "center",
              gap: 40,
              flexWrap: "wrap",
            }}
          >
            {STATS.map((stat) => (
              <div key={stat.value} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: C.accent,
                    fontFamily: "'Outfit', sans-serif",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: C.textDim,
                    marginTop: 4,
                    letterSpacing: "0.01em",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
