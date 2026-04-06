"use client";

import { useState } from "react";
import { signInWithGoogle } from "@/lib/auth_google";

const C = {
  cardBorder: "rgba(255,255,255,0.08)",
  text: "#E8E6E1",
  textDim: "#5C5A54",
  errorBg: "rgba(232,90,74,0.08)",
  errorBorder: "rgba(232,90,74,0.20)",
  errorText: "#E85A4A",
};

interface Props {
  label?: string;
}

export default function GoogleSignInButton({ label = "Continuar com Google" }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      // Browser redireciona — execução para aqui.
    } catch {
      setError("Não foi possível conectar ao Google. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <button
        onClick={handleClick}
        disabled={loading}
        aria-label={label}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          background: "transparent",
          border: `1px solid ${C.cardBorder}`,
          borderRadius: 12,
          padding: "13px 16px",
          minHeight: 48,
          color: loading ? C.textDim : C.text,
          fontSize: 14,
          fontWeight: 500,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "'DM Sans', sans-serif",
          transition: "border-color 0.15s ease, color 0.15s ease",
          boxSizing: "border-box",
        }}
        onMouseEnter={(e) => {
          if (!loading) e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
        }}
        onMouseLeave={(e) => {
          if (!loading) e.currentTarget.style.borderColor = C.cardBorder;
        }}
      >
        {loading ? (
          <>
            <svg
              width="16" height="16" viewBox="0 0 16 16"
              style={{ animation: "spin 0.8s linear infinite" }}
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(232,230,225,0.3)" strokeWidth="2" />
              <path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke="#8A8880" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Redirecionando...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
            </svg>
            {label}
          </>
        )}
      </button>

      {error && (
        <p
          role="alert"
          style={{
            marginTop: 8,
            fontSize: 13,
            color: C.errorText,
            textAlign: "center",
            padding: "8px 12px",
            background: C.errorBg,
            border: `1px solid ${C.errorBorder}`,
            borderRadius: 8,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
