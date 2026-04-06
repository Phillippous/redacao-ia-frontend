'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

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
  score200: "#2DD4A8",
  score160: "#67D49E",
  score120: "#E8B84A",
  score80:  "#E88A4A",
  score40:  "#E85A4A",
  score0:   "#E84040",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getScoreColor(score: number): string {
  if (score >= 180) return C.score200
  if (score >= 140) return C.score160
  if (score >= 100) return C.score120
  if (score >= 60)  return C.score80
  if (score >= 20)  return C.score40
  return C.score0
}

function getScoreLabel(score: number): string {
  if (score >= 160) return "Excelente"
  if (score >= 120) return "Bom"
  if (score >= 80)  return "Regular"
  if (score >= 40)  return "Insuficiente"
  return "Crítico"
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Competencia {
  nota: number
  diagnostico: string
  pontos_perdidos: string
}

interface C5 extends Competencia {
  checklist: {
    acao: boolean
    agente: boolean
    meio_modo: boolean
    efeito: boolean
    detalhamento: boolean
  }
}

interface Submission {
  id: string
  tema: string
  nota_total: number
  resultado: {
    competencias: { c1: Competencia; c2: Competencia; c3: Competencia; c4: Competencia; c5: C5 }
    resumo_geral: string
  }
  created_at: string
}

const COMP_LABELS: Record<string, { short: string; full: string }> = {
  c1: { short: "C1", full: "Domínio da norma culta" },
  c2: { short: "C2", full: "Compreensão do tema" },
  c3: { short: "C3", full: "Argumentação" },
  c4: { short: "C4", full: "Coesão textual" },
  c5: { short: "C5", full: "Proposta de intervenção" },
}

const CHECKLIST_LABELS: Record<string, string> = {
  acao: "Ação",
  agente: "Agente",
  meio_modo: "Meio/Modo",
  efeito: "Efeito",
  detalhamento: "Detalhamento",
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const router = useRouter()
  const pathname = usePathname()

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 400 : false
  )
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 400)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
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
          const isActive =
            pathname === item.href ||
            (item.href === "/enviar" && pathname.startsWith("/resultado"))
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
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = C.text }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = C.textMuted }}
            >
              {item.label}
            </Link>
          )
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
  )
}

// ─── ScoreRing ────────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 64, stroke = 4, label }: { score: number; size?: number; stroke?: number; label?: string }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 200) * circumference
  const color = getScoreColor(score)
  const faixa = getScoreLabel(score)

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
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: size > 60 ? 20 : 14, fontWeight: 600, color: C.text, fontFamily: "'Outfit', sans-serif" }}>
            {score}
          </span>
        </div>
      </div>
      {label && <span style={{ fontSize: 11, color: C.textMuted, letterSpacing: "0.02em" }}>{label}</span>}
      {label && <span style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.04em", textTransform: "uppercase" }}>{faixa}</span>}
    </div>
  )
}

// ─── CompetencyCard ───────────────────────────────────────────────────────────
function CompetencyCard({
  id, data, expanded, onToggle,
}: {
  id: string
  data: Competencia & { checklist?: Record<string, boolean> }
  expanded: boolean
  onToggle: () => void
}) {
  const comp = COMP_LABELS[id]
  const color = getScoreColor(data.nota)
  const scoreLabel = getScoreLabel(data.nota)
  const contentId = `comp-content-${id}`

  return (
    <div style={{
      background: C.card,
      border: `1px solid ${expanded ? color + "30" : C.cardBorder}`,
      borderRadius: 16,
      transition: "border-color 0.3s ease",
      overflow: "hidden",
    }}>
      <div
        role="button" tabIndex={0}
        aria-expanded={expanded} aria-controls={contentId}
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle() } }}
        style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: color + "15",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 600, color, fontFamily: "'Outfit', sans-serif",
            flexShrink: 0,
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

      {expanded && (
        <div id={contentId} style={{ padding: "0 20px 18px", borderTop: `1px solid ${C.cardBorder}` }}>
          <div style={{ paddingTop: 16 }}>
            <p style={{ fontSize: 13, lineHeight: 1.75, color: C.text, marginBottom: 14 }}>
              {data.diagnostico}
            </p>
            <div style={{ background: color + "08", border: `1px solid ${color}20`, borderRadius: 10, padding: "12px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                Onde você perdeu pontos
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: C.text, margin: 0 }}>
                {data.pontos_perdidos}
              </p>
            </div>

            {data.checklist && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                  Checklist da proposta
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }} role="list" aria-label="Elementos da proposta de intervenção">
                  {Object.entries(data.checklist).map(([key, val]) => (
                    <span key={key} role="listitem" style={{
                      fontSize: 12, padding: "4px 10px", borderRadius: 6,
                      background: val ? "rgba(45,212,168,0.10)" : "rgba(232,90,74,0.10)",
                      color: val ? C.score200 : C.score40,
                      border: `1px solid ${val ? "rgba(45,212,168,0.20)" : "rgba(232,90,74,0.20)"}`,
                    }}>
                      {val ? "✓" : "✗"} {CHECKLIST_LABELS[key] ?? key}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ResultadoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const router = useRouter()
  const supabase = createClient()

  const [submission, setSubmission] = useState<Submission | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedComp, setExpandedComp] = useState<string | null>(null)

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 400 : false
  )
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 400)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase.auth.getSession()
        const token = data.session?.access_token
        if (!token) { router.push('/login'); return }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.status === 404) { setNotFound(true); return }
        if (!res.ok) { setError('Erro ao carregar os resultados.'); return }

        const found: Submission = await res.json()
        setSubmission(found)
      } catch {
        setError('Erro ao carregar os resultados.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const baseStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: C.bg,
    color: C.text,
    fontFamily: "'DM Sans', -apple-system, sans-serif",
  }

  if (loading) {
    return (
      <div style={baseStyle}>
        <Nav />
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, color: C.textMuted, fontSize: 14 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: "spin 0.8s linear infinite" }} aria-hidden="true">
              <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(138,136,128,0.3)" strokeWidth="2" />
              <path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" />
            </svg>
            Carregando resultado...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={baseStyle}>
        <Nav />
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ padding: "14px 18px", background: C.errorBg, border: `1px solid ${C.errorBorder}`, borderRadius: 10, color: C.errorText, fontSize: 14 }}>
            {error}
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !submission) {
    return (
      <div style={baseStyle}>
        <Nav />
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
          <p style={{ color: C.textMuted, fontSize: 14 }}>Redação não encontrada.</p>
          <Link href="/historico" style={{ color: C.accent, fontSize: 13, marginTop: 12, display: "inline-block", textDecoration: "underline", textUnderlineOffset: 3 }}>
            Ver histórico
          </Link>
        </div>
      </div>
    )
  }

  const resultadoParsed = typeof submission.resultado === 'string'
    ? JSON.parse(submission.resultado)
    : submission.resultado

  const { competencias, resumo_geral } = resultadoParsed
  const totalColor = getScoreColor(submission.nota_total / 5)
  const competenciaKeys = ['c1', 'c2', 'c3', 'c4', 'c5'] as const

  const ringSize = isMobile ? 48 : 64
  const ringStroke = isMobile ? 3 : 4
  const ringGap = isMobile ? 10 : 20

  return (
    <div style={baseStyle}>
      <Nav />

      <main style={{ maxWidth: 640, margin: "0 auto", padding: isMobile ? "24px 16px 48px" : "32px 24px 64px" }}>

        {/* Voltar */}
        <div style={{ marginBottom: 20 }}>
          <Link
            href="/historico"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.textMuted, fontSize: 13, textDecoration: "none", minHeight: 44, transition: "color 0.2s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M8.5 3L4.5 7l4 4" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Voltar ao histórico
          </Link>
        </div>

        {/* Tema */}
        <div style={{ fontSize: 12, color: C.textDim, marginBottom: 6 }}>{formatDate(submission.created_at)}</div>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 600, color: C.text, marginBottom: 24, lineHeight: 1.4, letterSpacing: "-0.01em" }}>
          {submission.tema}
        </h1>

        {/* Score hero */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 20, padding: isMobile ? "20px 16px" : "28px 24px", marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Nota total</div>
          <div style={{ fontSize: isMobile ? 44 : 56, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: totalColor, lineHeight: 1, letterSpacing: "-0.03em" }}>
            {submission.nota_total}
          </div>
          <div style={{ fontSize: 14, color: C.textDim, marginTop: 4 }}>de 1000 pontos</div>

          <div style={{ display: "flex", justifyContent: "center", gap: ringGap, marginTop: 28, flexWrap: "wrap" }}>
            {competenciaKeys.map((c) => (
              <ScoreRing key={c} score={competencias[c].nota} size={ringSize} stroke={ringStroke} label={COMP_LABELS[c].short} />
            ))}
          </div>
        </div>

        {/* Competency cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
            Detalhamento por competência
          </div>
          {competenciaKeys.map((c) => (
            <CompetencyCard
              key={c}
              id={c}
              data={competencias[c]}
              expanded={expandedComp === c}
              onToggle={() => setExpandedComp(expandedComp === c ? null : c)}
            />
          ))}
        </div>

        {/* Resumo geral */}
        {resumo_geral && (
          <div style={{ marginTop: 24, padding: "18px 22px", background: "rgba(45,212,168,0.06)", border: "1px solid rgba(45,212,168,0.15)", borderRadius: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              Resumo geral
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.75, color: C.text, margin: 0 }}>
              {resumo_geral}
            </p>
          </div>
        )}

        {/* CTAs */}
        <div style={{ marginTop: 36, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => router.push('/enviar')}
            style={{
              background: C.accent, border: "none", borderRadius: 12,
              padding: "14px 32px", minHeight: 48,
              color: C.bg, fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.accentHover; e.currentTarget.style.transform = "translateY(-1px)" }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; e.currentTarget.style.transform = "translateY(0)" }}
          >
            Nova redação
          </button>
          <button
            onClick={() => router.push('/historico')}
            style={{
              background: "transparent",
              border: `1px solid ${C.cardBorder}`,
              borderRadius: 12, padding: "14px 32px", minHeight: 48,
              color: C.textMuted, fontSize: 14, fontWeight: 500,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.color = C.text }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.cardBorder; e.currentTarget.style.color = C.textMuted }}
          >
            Ver histórico
          </button>
        </div>
      </main>
    </div>
  )
}
