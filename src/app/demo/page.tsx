"use client";

import { useState } from "react";
import Link from "next/link";

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
  score200: "#2DD4A8",
  score160: "#67D49E",
  score120: "#E8B84A",
  score80: "#E88A4A",
  score40: "#E85A4A",
  score0: "#E84040",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getScoreColor(score: number): string {
  if (score >= 180) return C.score200;
  if (score >= 140) return C.score160;
  if (score >= 100) return C.score120;
  if (score >= 60) return C.score80;
  if (score >= 20) return C.score40;
  return C.score0;
}

function getScoreLabel(score: number): string {
  if (score >= 160) return "Excelente";
  if (score >= 120) return "Bom";
  if (score >= 80) return "Regular";
  if (score >= 40) return "Insuficiente";
  return "Crítico";
}

// ─── Dados demo (SAMPLE_RESULTS[0] do protótipo V2) ───────────────────────────
const DEMO = {
  date: "27 Mar 2026",
  tema: "A invisibilidade do trabalho de cuidado realizado pela mulher no Brasil",
  total: 760,
  resumo_geral:
    "Sua redação demonstra bom domínio argumentativo e estrutural, com uma proposta de intervenção quase completa. O principal ponto de atenção está no aprofundamento dos argumentos (C3), que precisa de evidências concretas para alcançar o nível superior.",
  scores: {
    c1: {
      nota: 160,
      diagnostico:
        "Bom domínio da norma culta. Você demonstra boa capacidade de articular períodos compostos e usar vocabulário diversificado. Alguns desvios pontuais de acentuação e concordância não comprometem a compreensão do texto.",
      pontos_perdidos:
        "Dois erros de concordância nominal ('os problema social' e 'as mulher brasileira') e acentuação incorreta em 'saúde' grafado sem acento impediram a nota máxima.",
    },
    c2: {
      nota: 160,
      diagnostico:
        "O tema é abordado de forma consistente ao longo do texto. O primeiro parágrafo de desenvolvimento foca adequadamente na invisibilidade do cuidado doméstico. Um leve desvio tangencial no segundo parágrafo, ao tratar de desigualdade salarial como argumento central em vez do trabalho de cuidado, impede a nota máxima.",
      pontos_perdidos:
        "O segundo parágrafo de desenvolvimento trata a desigualdade salarial como tema central, quando deveria subordiná-la ao tema do trabalho de cuidado.",
    },
    c3: {
      nota: 120,
      diagnostico:
        "Os argumentos são pertinentes mas carecem de aprofundamento. Você menciona dados sobre jornada dupla feminina sem especificar fontes, e a relação causal entre invisibilidade do cuidado e impactos econômicos é afirmada sem demonstração.",
      pontos_perdidos:
        "Faltou evidência concreta para sustentar a afirmação sobre jornada dupla feminina. As referências são genéricas ('estudos mostram que...') sem especificar quais estudos.",
    },
    c4: {
      nota: 160,
      diagnostico:
        "Boa variedade de conectivos e mecanismos de coesão referencial. O texto flui bem entre os parágrafos e as transições são majoritariamente adequadas.",
      pontos_perdidos:
        "O conectivo 'portanto' no início do terceiro parágrafo não corresponde a uma conclusão lógica do parágrafo anterior — o argumento muda de direção sem justificativa.",
    },
    c5: {
      nota: 160,
      diagnostico:
        "Proposta bem estruturada com quatro dos cinco elementos presentes e desenvolvidos. O agente (Ministério da Mulher), a ação (campanha nacional) e o efeito esperado (valorização social do cuidado) estão claros.",
      pontos_perdidos:
        "O meio/modo é genérico — 'por meio de políticas públicas de valorização' não especifica o mecanismo concreto da campanha proposta.",
      checklist: {
        acao: true,
        agente: true,
        meio_modo: false,
        efeito: true,
        detalhamento: true,
      },
    },
  },
};

const COMP_LABELS: Record<string, { short: string; full: string }> = {
  c1: { short: "C1", full: "Domínio da norma culta" },
  c2: { short: "C2", full: "Compreensão do tema" },
  c3: { short: "C3", full: "Argumentação" },
  c4: { short: "C4", full: "Coesão textual" },
  c5: { short: "C5", full: "Proposta de intervenção" },
};

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <Link href="/" aria-label="nota. — Voltar à página inicial" style={{ display: "flex", alignItems: "baseline", gap: 1, textDecoration: "none" }}>
      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 20, color: C.text, letterSpacing: "-0.025em", lineHeight: 1 }}>
        nota
      </span>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, marginBottom: 2, flexShrink: 0 }} />
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
      <Logo />
      <div style={{ display: "flex", gap: 6 }}>
        <Link
          href="/login"
          style={{
            background: "transparent", borderRadius: 10,
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

// ─── ScoreRing ────────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 64, stroke = 4, label }: { score: number; size?: number; stroke?: number; label?: string }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 200) * circumference;
  const color = getScoreColor(score);
  const faixa = getScoreLabel(score);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size} height={size}
          style={{ transform: "rotate(-90deg)", position: "absolute", top: 0, left: 0 }}
          role="img"
          aria-label={`Competência ${label ?? ""}: ${score} de 200 pontos — ${faixa}`}
        >
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={stroke} />
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference - progress}`}
            style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: size > 60 ? 20 : 15, fontWeight: 600, color: C.text, fontFamily: "'Outfit', sans-serif" }}>
            {score}
          </span>
        </div>
      </div>
      {label && <span style={{ fontSize: 11, color: C.textMuted, letterSpacing: "0.02em" }}>{label}</span>}
      {label && <span style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.04em", textTransform: "uppercase" }}>{faixa}</span>}
    </div>
  );
}

// ─── CompetencyCard ───────────────────────────────────────────────────────────
function CompetencyCard({
  id,
  data,
  expanded,
  onToggle,
}: {
  id: string;
  data: typeof DEMO.scores.c1 & { checklist?: Record<string, boolean> };
  expanded: boolean;
  onToggle: () => void;
}) {
  const comp = COMP_LABELS[id];
  const color = getScoreColor(data.nota);
  const scoreLabel = getScoreLabel(data.nota);
  const contentId = `comp-content-${id}`;

  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${expanded ? color + "30" : C.cardBorder}`,
        borderRadius: 16,
        transition: "border-color 0.3s ease",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); } }}
        style={{
          padding: "16px 20px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: color + "15",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 600, color, fontFamily: "'Outfit', sans-serif",
          }}>
            {comp.short}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{comp.full}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{scoreLabel}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{ width: 80, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.10)", overflow: "hidden" }}
              role="progressbar" aria-valuenow={data.nota} aria-valuemin={0} aria-valuemax={200}
              aria-label={`${comp.short}: ${data.nota} de 200`}
            >
              <div style={{ width: `${(data.nota / 200) * 100}%`, height: "100%", borderRadius: 3, background: color, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 600, color, fontFamily: "'Outfit', sans-serif", minWidth: 34, textAlign: "right" }}>
              {data.nota}
            </span>
          </div>
          <svg
            width="16" height="16" viewBox="0 0 16 16"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", color: C.textMuted, flexShrink: 0 }}
            aria-hidden="true"
          >
            <path d="M3 6l5 5 5-5" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div id={contentId} style={{ padding: "0 20px 18px", borderTop: `1px solid ${C.cardBorder}` }}>
          <div style={{ paddingTop: 16 }}>
            <p style={{ fontSize: 13, lineHeight: 1.75, color: C.text, marginBottom: 14 }}>
              {data.diagnostico}
            </p>
            <div style={{
              background: color + "08",
              border: `1px solid ${color}20`,
              borderRadius: 10, padding: "12px 16px",
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                Onde você perdeu pontos
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: C.text, margin: 0 }}>
                {data.pontos_perdidos}
              </p>
            </div>

            {"checklist" in data && data.checklist && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                  Checklist da proposta
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }} role="list" aria-label="Elementos da proposta de intervenção">
                  {Object.entries(data.checklist).map(([key, val]) => (
                    <span
                      key={key}
                      role="listitem"
                      style={{
                        fontSize: 12, padding: "4px 10px", borderRadius: 6,
                        background: val ? "rgba(45,212,168,0.10)" : "rgba(232,90,74,0.10)",
                        color: val ? C.score200 : C.score40,
                        border: `1px solid ${val ? "rgba(45,212,168,0.20)" : "rgba(232,90,74,0.20)"}`,
                      }}
                    >
                      {val ? "✓" : "✗"} {key.replace("_", "/")}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DemoPage() {
  const [expandedComp, setExpandedComp] = useState<string | null>(null);
  const r = DEMO;
  const totalColor = getScoreColor(r.total / 5);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <Nav />

      <main style={{ maxWidth: 640, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* Voltar */}
        <div style={{ marginBottom: 20 }}>
          <Link
            href="/"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              color: C.textMuted, fontSize: 13, textDecoration: "none",
              minHeight: 44,
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M8.5 3L4.5 7l4 4" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Voltar
          </Link>
        </div>

        {/* Badge demo */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            display: "inline-flex", alignItems: "center",
            background: "rgba(232,184,74,0.08)",
            border: "1px solid rgba(232,184,74,0.18)",
            borderRadius: 8, padding: "5px 12px",
            fontSize: 11, fontWeight: 600, color: C.score120,
            textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            Exemplo de correção
          </div>
        </div>

        {/* Tema */}
        <div style={{ fontSize: 12, color: C.textDim, marginBottom: 6 }}>{r.date}</div>
        <h1
          style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 600,
            color: C.text, marginBottom: 28, lineHeight: 1.4, letterSpacing: "-0.01em",
          }}
        >
          {r.tema}
        </h1>

        {/* Score hero */}
        <div style={{
          background: C.card,
          border: `1px solid ${C.cardBorder}`,
          borderRadius: 20, padding: "28px 24px",
          marginBottom: 24, textAlign: "center",
        }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
            Nota total
          </div>
          <div style={{
            fontSize: 56, fontWeight: 800,
            fontFamily: "'Outfit', sans-serif",
            color: totalColor, lineHeight: 1,
            letterSpacing: "-0.03em",
          }}>
            {r.total}
          </div>
          <div style={{ fontSize: 14, color: C.textDim, marginTop: 4 }}>de 1000 pontos</div>

          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 28, flexWrap: "wrap" }}>
            {(["c1", "c2", "c3", "c4", "c5"] as const).map((c) => (
              <ScoreRing key={c} score={r.scores[c].nota} size={64} stroke={4} label={COMP_LABELS[c].short} />
            ))}
          </div>
        </div>

        {/* Competency cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
            Detalhamento por competência
          </div>
          {(["c1", "c2", "c3", "c4", "c5"] as const).map((c) => (
            <CompetencyCard
              key={c}
              id={c}
              data={r.scores[c] as typeof DEMO.scores.c1 & { checklist?: Record<string, boolean> }}
              expanded={expandedComp === c}
              onToggle={() => setExpandedComp(expandedComp === c ? null : c)}
            />
          ))}
        </div>

        {/* Resumo geral */}
        <div style={{
          marginTop: 24, padding: "18px 22px",
          background: "rgba(45,212,168,0.06)",
          border: "1px solid rgba(45,212,168,0.15)",
          borderRadius: 14,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            Resumo geral
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.75, color: C.text, margin: 0 }}>
            {r.resumo_geral}
          </p>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 4, textAlign: "center" }}>
            Quer ver a correção da sua própria redação?
          </p>
          <Link
            href="/cadastro"
            style={{
              background: C.accent,
              border: "none", borderRadius: 12,
              padding: "14px 40px", minHeight: 52,
              display: "inline-flex", alignItems: "center",
              color: C.bg, fontSize: 15, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif", textDecoration: "none",
              letterSpacing: "-0.01em",
              boxShadow: "0 0 48px rgba(45,212,168,0.18)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.accentHover;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.accent;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Criar conta grátis
          </Link>
        </div>
      </main>
    </div>
  );
}
