'use client'

import { useEffect, useState } from 'react'
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Competencia {
  nota: number
  diagnostico: string
  pontos_perdidos: string
}

interface Submission {
  id: string
  tema: string
  nota_total: number
  c1: number
  c2: number
  c3: number
  c4: number
  c5: number
  resultado?: {
    competencias: { c1: Competencia; c2: Competencia; c3: Competencia; c4: Competencia; c5: Competencia }
    resumo_geral: string
  }
  created_at: string
}

const COMP_LABELS: Record<string, string> = {
  c1: "C1", c2: "C2", c3: "C3", c4: "C4", c5: "C5",
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
          const isActive = pathname === item.href
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

// ─── HistoryCard ──────────────────────────────────────────────────────────────
function HistoryCard({ submission, onClick }: { submission: Submission; onClick: () => void }) {
  const totalColor = getScoreColor(submission.nota_total / 5)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick() } }}
      aria-label={`Redação de ${formatDate(submission.created_at)}: ${submission.tema}. Nota total: ${submission.nota_total} de 1000`}
      style={{
        background: C.card,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 16, padding: "18px 22px",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"
        e.currentTarget.style.transform = "translateY(-1px)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.cardBorder
        e.currentTarget.style.transform = "translateY(0)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ flex: 1, marginRight: 16 }}>
          <div style={{ fontSize: 12, color: C.textDim, marginBottom: 4 }}>{formatDate(submission.created_at)}</div>
          <div style={{
            fontSize: 14, fontWeight: 500, color: C.text, lineHeight: 1.4,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          } as React.CSSProperties}>
            {submission.tema}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: totalColor, fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>
            {submission.nota_total}
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>/ 1000</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {(["c1", "c2", "c3", "c4", "c5"] as const).map((c) => {
          const nota = submission[c as keyof Submission] as number ?? 0
          return (
            <div key={c} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", height: 4, borderRadius: 2, background: "rgba(255,255,255,0.10)", overflow: "hidden" }}>
                <div style={{ width: `${(nota / 200) * 100}%`, height: "100%", borderRadius: 2, background: getScoreColor(nota) }} />
              </div>
              <span style={{ fontSize: 10, color: C.textDim }}>{COMP_LABELS[c]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HistoricoPage() {
  const router = useRouter()
  const supabase = createClient()

  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) { setError('Erro ao carregar o histórico.'); return }

        const list: Submission[] = await res.json()
        setSubmissions(list)
      } catch {
        setError('Erro ao carregar o histórico.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

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
            Carregando histórico...
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

  if (submissions.length === 0) {
    return (
      <div style={baseStyle}>
        <Nav />
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>✏️</div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 600, color: C.text, marginBottom: 8, letterSpacing: "-0.01em" }}>
            Nenhuma redação ainda
          </h2>
          <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 28 }}>
            Envie sua primeira redação para ver o resultado aqui.
          </p>
          <Link
            href="/enviar"
            style={{
              background: C.accent, borderRadius: 12,
              padding: "14px 32px", minHeight: 48,
              display: "inline-flex", alignItems: "center",
              color: C.bg, fontSize: 14, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif", textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.accentHover; e.currentTarget.style.transform = "translateY(-1px)" }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; e.currentTarget.style.transform = "translateY(0)" }}
          >
            Escrever redação
          </Link>
        </div>
      </div>
    )
  }

  const avgTotal = Math.round(submissions.reduce((a, s) => a + s.nota_total, 0) / submissions.length)
  const bestTotal = Math.max(...submissions.map((s) => s.nota_total))
  const compKeys = ["c1", "c2", "c3", "c4", "c5"] as const

  function getCompNota(s: Submission, c: keyof Submission): number {
    return s[c] as number ?? 0
  }

  const compAvgs = compKeys.map((c) => {
    const notas = submissions.map((s) => getCompNota(s, c))
    return Math.round(notas.reduce((a, n) => a + n, 0) / notas.length)
  })

  return (
    <div style={baseStyle}>
      <Nav />

      <main style={{ maxWidth: 640, margin: "0 auto", padding: isMobile ? "24px 16px 48px" : "32px 24px 64px" }}>

        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 600, color: C.text, marginBottom: 4, letterSpacing: "-0.01em" }}>
          Suas redações
        </h1>
        <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 24 }}>
          {submissions.length} {submissions.length === 1 ? 'redação corrigida' : 'redações corrigidas'}
        </p>

        {/* Summary stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: isMobile ? 6 : 10, marginBottom: 28 }}>
          {[
            { label: "Média geral", value: avgTotal, highlight: false },
            { label: "Melhor nota", value: bestTotal, highlight: true },
            { label: "Redações", value: submissions.length, highlight: false },
          ].map((stat, i) => (
            <div key={i} style={{ background: C.surface, borderRadius: 14, padding: isMobile ? "12px 8px" : "16px 14px", textAlign: "center" }}>
              <div style={{ fontSize: isMobile ? 10 : 11, color: C.textDim, marginBottom: 6 }}>{stat.label}</div>
              <div style={{
                fontSize: isMobile ? 18 : 22, fontWeight: 700,
                color: stat.highlight ? C.score200 : C.text,
                fontFamily: "'Outfit', sans-serif",
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Competency averages */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: "18px 20px", marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
            Média por competência
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {compKeys.map((c, i) => {
              const avg = compAvgs[i]
              const color = getScoreColor(avg)
              return (
                <div key={c} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 12, color: C.textMuted, minWidth: 24 }}>{COMP_LABELS[c]}</span>
                  <div style={{ flex: 1, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.10)", overflow: "hidden" }}>
                    <div style={{ width: `${(avg / 200) * 100}%`, height: "100%", borderRadius: 4, background: color, transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color, minWidth: 30, textAlign: "right", fontFamily: "'Outfit', sans-serif" }}>{avg}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {submissions.map((s) => (
            <HistoryCard
              key={s.id}
              submission={s}
              onClick={() => router.push(`/resultado/${s.id}`)}
            />
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 28, textAlign: "center" }}>
          <Link
            href="/enviar"
            style={{
              background: C.accent, borderRadius: 12,
              padding: "14px 32px", minHeight: 48,
              display: "inline-flex", alignItems: "center",
              color: C.bg, fontSize: 14, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif", textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.accentHover; e.currentTarget.style.transform = "translateY(-1px)" }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; e.currentTarget.style.transform = "translateY(0)" }}
          >
            Escrever nova redação
          </Link>
        </div>
      </main>
    </div>
  )
}
