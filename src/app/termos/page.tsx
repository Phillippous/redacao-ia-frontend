"use client";

import Link from "next/link";

export default function TermosPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0E0C",
        color: "#F5F2EE",
        fontFamily: "'DM Sans', sans-serif",
        padding: "48px 24px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <Link
            href="/cadastro"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "#5BBFB5",
              textDecoration: "none",
              fontSize: 14,
              marginBottom: 32,
            }}
          >
            ← Voltar
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: 22,
                color: "#F5F2EE",
                letterSpacing: "-0.02em",
              }}
            >
              nota
            </span>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#5BBFB5",
                display: "inline-block",
                marginLeft: -4,
              }}
            />
          </div>

          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 28,
              color: "#F5F2EE",
              marginBottom: 8,
              letterSpacing: "-0.02em",
            }}
          >
            Termos de Uso
          </h1>
          <p style={{ color: "#9C9A94", fontSize: 14 }}>
            Última atualização: março de 2026 · Versão 1.0
          </p>
        </div>

        {/* Content */}
        <div style={{ lineHeight: 1.8, color: "#D4D0C8" }}>

          <Section title="1. Sobre o Serviço">
            <p>
              O <strong style={{ color: "#F5F2EE" }}>nota.</strong> é uma plataforma de correção automatizada de
              redações no formato ENEM, desenvolvida para auxiliar estudantes na preparação para o
              Exame Nacional do Ensino Médio. O serviço utiliza inteligência artificial para avaliar
              textos dissertativo-argumentativos de acordo com as cinco competências oficiais do INEP.
            </p>
            <p style={{ marginTop: 12 }}>
              O diagnóstico gerado pela plataforma é de natureza <strong style={{ color: "#F5F2EE" }}>orientativa e pedagógica</strong>.
              Ele não substitui a avaliação de um professor ou corretor humano, nem garante a nota
              que o estudante obterá no ENEM real.
            </p>
          </Section>

          <Section title="2. Aceitação dos Termos">
            <p>
              Ao criar uma conta e utilizar o nota., você declara ter lido, compreendido e concordado
              com estes Termos de Uso e com a nossa{" "}
              <Link href="/privacidade" style={{ color: "#5BBFB5" }}>
                Política de Privacidade
              </Link>
              . Caso não concorde com qualquer disposição, não utilize o serviço.
            </p>
          </Section>

          <Section title="3. Elegibilidade e Cadastro">
            <p>
              O serviço é destinado a estudantes com foco no ENEM. Para se cadastrar:
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 8 }}>
              <li style={{ marginBottom: 8 }}>
                Usuários com <strong style={{ color: "#F5F2EE" }}>16 anos ou mais</strong> podem criar uma conta
                de forma independente, desde que aceitem estes termos.
              </li>
              <li style={{ marginBottom: 8 }}>
                Usuários com <strong style={{ color: "#F5F2EE" }}>menos de 16 anos</strong> precisam do
                consentimento expresso de um responsável legal, nos termos do Art. 14 da Lei Geral
                de Proteção de Dados (LGPD).
              </li>
              <li>
                Você deve fornecer informações verdadeiras e manter seus dados atualizados.
              </li>
            </ul>
          </Section>

          <Section title="4. Uso Permitido">
            <p>O nota. pode ser utilizado para:</p>
            <ul style={{ paddingLeft: 20, marginTop: 8 }}>
              <li style={{ marginBottom: 6 }}>Submeter redações próprias para correção e diagnóstico.</li>
              <li style={{ marginBottom: 6 }}>Consultar o histórico de redações corrigidas.</li>
              <li>Utilizar o diagnóstico para orientar seus estudos.</li>
            </ul>
          </Section>

          <Section title="5. Uso Proibido">
            <p>É expressamente proibido:</p>
            <ul style={{ paddingLeft: 20, marginTop: 8 }}>
              <li style={{ marginBottom: 8 }}>
                Submeter redações de terceiros como se fossem próprias com o objetivo de fraudar avaliações.
              </li>
              <li style={{ marginBottom: 8 }}>
                Utilizar mecanismos automatizados (bots, scripts) para submeter redações em massa ou
                sobrecarregar o serviço.
              </li>
              <li style={{ marginBottom: 8 }}>
                Tentar acessar, modificar ou extrair dados de outros usuários.
              </li>
              <li style={{ marginBottom: 8 }}>
                Reproduzir, distribuir ou comercializar qualquer parte da plataforma sem autorização.
              </li>
              <li>
                Submeter conteúdo que viole direitos autorais, a legislação brasileira ou os direitos
                humanos.
              </li>
            </ul>
          </Section>

          <Section title="6. Conteúdo Submetido">
            <p>
              Ao enviar uma redação, você declara que o conteúdo não viola leis brasileiras nem
              direitos de terceiros. Você mantém os direitos sobre suas redações.
            </p>
            <p style={{ marginTop: 12 }}>
              Você autoriza o nota. a processar o texto submetido exclusivamente para fins de
              correção automatizada, sem utilizá-lo para treinar modelos de IA ou compartilhá-lo
              com terceiros não autorizados. Veja nossa{" "}
              <Link href="/privacidade" style={{ color: "#5BBFB5" }}>
                Política de Privacidade
              </Link>{" "}
              para mais detalhes.
            </p>
          </Section>

          <Section title="7. Limitação de Responsabilidade">
            <p>
              O nota. disponibiliza o serviço "no estado em que se encontra". Não garantimos que:
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 8 }}>
              <li style={{ marginBottom: 8 }}>
                A nota gerada pela IA corresponderá exatamente à nota atribuída pelo INEP no ENEM real.
              </li>
              <li style={{ marginBottom: 8 }}>
                O serviço estará disponível de forma ininterrupta ou livre de erros.
              </li>
            </ul>
            <p style={{ marginTop: 12 }}>
              Em nenhuma hipótese o nota. será responsável por danos indiretos, lucros cessantes
              ou decisões tomadas exclusivamente com base nos diagnósticos gerados pela plataforma.
            </p>
          </Section>

          <Section title="8. Propriedade Intelectual">
            <p>
              Todo o conteúdo da plataforma — incluindo marca, interface, código, metodologia de
              avaliação e documentação — é propriedade do nota. e está protegido pela legislação
              brasileira de propriedade intelectual. É proibida a reprodução sem autorização expressa.
            </p>
          </Section>

          <Section title="9. Suspensão e Cancelamento">
            <p>
              Reservamo-nos o direito de suspender ou encerrar contas que violem estes Termos,
              com ou sem aviso prévio, dependendo da gravidade da infração. Você pode solicitar
              o cancelamento da sua conta a qualquer momento pelo e-mail de contato abaixo.
            </p>
          </Section>

          <Section title="10. Alterações nestes Termos">
            <p>
              Podemos atualizar estes Termos periodicamente. Alterações relevantes serão comunicadas
              por e-mail com antecedência mínima de 7 dias. O uso continuado da plataforma após
              a vigência das alterações implica aceitação dos novos termos.
            </p>
          </Section>

          <Section title="11. Lei Aplicável e Foro">
            <p>
              Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o
              foro da Comarca de São Paulo – SP para dirimir quaisquer controvérsias decorrentes
              deste instrumento, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
            </p>
          </Section>

          <Section title="12. Contato">
            <p>
              Para dúvidas, solicitações ou notificações relacionadas a estes Termos:
            </p>
            <div
              style={{
                background: "#1A1916",
                border: "1px solid #2A2925",
                borderRadius: 10,
                padding: "16px 20px",
                marginTop: 12,
              }}
            >
              <p style={{ margin: 0, color: "#F5F2EE" }}>
                <strong>nota.</strong>
              </p>
              <p style={{ margin: "6px 0 0", color: "#9C9A94", fontSize: 13 }}>
                RRM Consultoria · CNPJ 51.381.377/0001-79
              </p>
              <p style={{ margin: "8px 0 0", color: "#9C9A94", fontSize: 14 }}>
                E-mail: <a href="mailto:nota.privacidade@gmail.com" style={{ color: "#5BBFB5" }}>nota.privacidade@gmail.com</a>
              </p>
            </div>
          </Section>

        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 56,
            paddingTop: 24,
            borderTop: "1px solid #2A2925",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ color: "#5A5850", fontSize: 13, margin: 0 }}>
            © 2026 nota. · Todos os direitos reservados
          </p>
          <Link href="/privacidade" style={{ color: "#5BBFB5", fontSize: 13, textDecoration: "none" }}>
            Política de Privacidade →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 600,
          fontSize: 17,
          color: "#F5F2EE",
          marginBottom: 14,
          paddingBottom: 10,
          borderBottom: "1px solid #2A2925",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      <div style={{ fontSize: 15 }}>{children}</div>
    </div>
  );
}