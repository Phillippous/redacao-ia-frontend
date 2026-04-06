import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "nota. — Correção de redação ENEM por IA",
  description:
    "Corrija sua redação do ENEM com inteligência artificial. Feedback por competência (C1–C5), alinhado ao padrão INEP. Resultado em segundos.",
  openGraph: {
    title: "nota.",
    description:
      "Correção de redação ENEM por IA. Nota por competência. Feedback em segundos.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
