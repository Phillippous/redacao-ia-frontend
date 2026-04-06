"use client";

import Link from "next/link";

export default function PrivacidadePage() {
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
            Política de Privacidade
          </h1>
          <p style={{ color: "#9C9A94", fontSize: 14 }}>
            Última atualização: março de 2026 · Versão 1.0
          </p>
        </div>

        {/* Intro banner */}
        <div
          style={{
            background: "rgba(91, 191, 181, 0.08)",
            border: "1px solid rgba(91, 191, 181, 0.2)",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 40,
            fontSize: 14,
            color: "#A8D8D4",
            lineHeight: 1.7,
          }}
        >
          <strong style={{ color: "#5BBFB5" }}>Seu dado pertence a você.</strong> Esta política explica
          de forma clara quais informações coletamos, por que as coletamos e como você pode
          exercer seus direitos previstos na Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD).
        </div>

        {/* Content */}
        <div style={{ lineHeight: 1.8, color: "#D4D0C8" }}>

          <Section title="1. Quem é o Controlador">
            <p>
              O controlador responsável pelo tratamento dos seus dados pessoais é:
            </p>
            <InfoBlock>
              <p style={{ margin: 0, color: "#F5F2EE", fontWeight: 600 }}>nota.</p>
              <p style={{ margin: "6px 0 0", color: "#9C9A94", fontSize: 13 }}>
                RRM Consultoria · CNPJ 51.381.377/0001-79
              </p>
              <p style={{ margin: "8px 0 0", color: "#9C9A94", fontSize: 14 }}>
                E-mail do Encarregado (DPO):{" "}
                <a href="mailto:nota.privacidade@gmail.com" style={{ color: "#5BBFB5" }}>
                  nota.privacidade@gmail.com
                </a>
              </p>
            </InfoBlock>
          </Section>

          <Section title="2. Dados que Coletamos">
            <p>Coletamos apenas os dados necessários para a prestação do serviço:</p>

            <Table
              headers={["Dado", "Finalidade", "Base Legal (LGPD)"]}
              rows={[
                ["Nome", "Identificação e personalização", "Consentimento – Art. 7º, I"],
                ["E-mail", "Autenticação e comunicações essenciais", "Consentimento – Art. 7º, I"],
                ["Senha (hash)", "Segurança do acesso à conta", "Consentimento – Art. 7º, I"],
                ["Redações submetidas", "Processamento pela IA para gerar correção", "Execução de contrato – Art. 7º, V"],
                ["Resultados e diagnósticos", "Histórico de desempenho do estudante", "Execução de contrato – Art. 7º, V"],
                ["Data/hora de submissão", "Ordenação do histórico e controle de uso", "Interesse legítimo – Art. 7º, IX"],
                ["Aceite de termos (timestamp)", "Registro de conformidade LGPD", "Obrigação legal – Art. 7º, II"],
              ]}
            />

            <p style={{ marginTop: 16 }}>
              <strong style={{ color: "#F5F2EE" }}>Não coletamos</strong> dados de pagamento,
              localização, biometria ou qualquer dado sensível nos termos do Art. 11 da LGPD.
            </p>
          </Section>

          <Section title="3. Como Usamos os Dados">
            <p>Seus dados são utilizados exclusivamente para:</p>
            <ul style={{ paddingLeft: 20, marginTop: 8 }}>
              <li style={{ marginBottom: 8 }}>Criar e manter sua conta de acesso.</li>
              <li style={{ marginBottom: 8 }}>
                Processar as redações submetidas por meio da API de inteligência artificial e
                devolver o diagnóstico estruturado por competência.
              </li>
              <li style={{ marginBottom: 8 }}>
                Armazenar seu histórico de correções para consulta futura.
              </li>
              <li style={{ marginBottom: 8 }}>
                Enviar comunicações relacionadas ao serviço (ex.: alterações nos Termos de Uso).
              </li>
              <li>
                Cumprir obrigações legais aplicáveis.
              </li>
            </ul>
            <p style={{ marginTop: 12 }}>
              <strong style={{ color: "#F5F2EE" }}>Não utilizamos</strong> seus dados para
              treinar modelos de inteligência artificial, vender informações a anunciantes ou
              realizar qualquer forma de perfilamento para fins publicitários.
            </p>
          </Section>

          <Section title="4. Compartilhamento com Terceiros">
            <p>
              Seus dados são compartilhados apenas com os seguintes fornecedores, estritamente
              para viabilizar a operação do serviço:
            </p>
            <Table
              headers={["Fornecedor", "Finalidade", "País"]}
              rows={[
                ["Supabase", "Banco de dados e autenticação", "Brasil (São Paulo)"],
                ["Anthropic (API Claude)", "Processamento da redação pela IA", "EUA"],
                ["Vercel", "Hospedagem do frontend", "EUA"],
              ]}
            />
            <p style={{ marginTop: 16 }}>
              No caso da Anthropic, o texto da redação é enviado para processamento e não é
              retido para fins de treinamento, conforme a política de uso de dados da API da
              Anthropic. A transferência internacional é realizada com base nas garantias
              adequadas previstas no Art. 33 da LGPD.
            </p>
          </Section>

          <Section title="5. Tratamento de Dados de Menores">
            <p>
              A plataforma é direcionada a estudantes em fase de preparação para o ENEM, o que
              inclui jovens com menos de 18 anos. Adotamos as seguintes medidas:
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 8 }}>
              <li style={{ marginBottom: 8 }}>
                Usuários com <strong style={{ color: "#F5F2EE" }}>menos de 16 anos</strong> somente
                podem utilizar o serviço mediante consentimento expresso de um responsável legal,
                conforme o Art. 14 da LGPD.
              </li>
              <li style={{ marginBottom: 8 }}>
                Não coletamos dados além do mínimo necessário, em observância ao princípio da
                necessidade (Art. 6º, III da LGPD).
              </li>
              <li>
                O responsável legal pode solicitar o acesso, correção ou exclusão dos dados do
                menor a qualquer momento pelo e-mail de contato.
              </li>
            </ul>
          </Section>

          <Section title="6. Prazo de Retenção">
            <p>
              Seus dados são mantidos enquanto sua conta estiver ativa. Após o encerramento da
              conta, os dados pessoais são excluídos em até <strong style={{ color: "#F5F2EE" }}>30 dias</strong>,
              salvo obrigação legal de retenção por prazo superior.
            </p>
            <p style={{ marginTop: 12 }}>
              Dados necessários para cumprir obrigações legais ou exercício regular de direitos
              em processo judicial, administrativo ou arbitral podem ser mantidos pelo prazo
              prescricional aplicável.
            </p>
          </Section>

          <Section title="7. Segurança">
            <p>Adotamos medidas técnicas e organizacionais para proteger seus dados:</p>
            <ul style={{ paddingLeft: 20, marginTop: 8 }}>
              <li style={{ marginBottom: 8 }}>
                Comunicações criptografadas via HTTPS/TLS em trânsito.
              </li>
              <li style={{ marginBottom: 8 }}>
                Senhas armazenadas exclusivamente em formato hash (bcrypt via Supabase Auth).
              </li>
              <li style={{ marginBottom: 8 }}>
                Banco de dados com criptografia em repouso (Supabase, região São Paulo).
              </li>
              <li>
                Políticas de Row Level Security (RLS) garantindo que cada usuário acesse
                apenas seus próprios dados.
              </li>
            </ul>
          </Section>

          <Section title="8. Seus Direitos como Titular">
            <p>
              Você tem os seguintes direitos garantidos pela LGPD (Art. 18), que podem ser
              exercidos a qualquer momento por e-mail:
            </p>
            <Table
              headers={["Direito", "O que significa"]}
              rows={[
                ["Confirmação e acesso", "Saber se tratamos seus dados e obter uma cópia"],
                ["Correção", "Corrigir dados incompletos, inexatos ou desatualizados"],
                ["Anonimização ou exclusão", "Solicitar a exclusão de dados desnecessários"],
                ["Portabilidade", "Receber seus dados em formato estruturado"],
                ["Informação sobre compartilhamento", "Saber com quem compartilhamos seus dados"],
                ["Revogação do consentimento", "Retirar o consentimento dado anteriormente"],
                ["Oposição", "Opor-se a tratamentos realizados com dispensa de consentimento"],
              ]}
            />
            <p style={{ marginTop: 16 }}>
              Para exercer qualquer desses direitos, envie um e-mail para{" "}
              <a href="mailto:nota.privacidade@gmail.com" style={{ color: "#5BBFB5" }}>
                nota.privacidade@gmail.com
              </a>{" "}
              identificando-se e descrevendo sua solicitação. Responderemos em até 15 dias úteis.
            </p>
          </Section>

          <Section title="9. Cookies e Tecnologias Similares">
            <p>
              Utilizamos apenas cookies essenciais para manter sua sessão autenticada. Não
              utilizamos cookies de rastreamento, publicidade ou analytics de terceiros.
            </p>
          </Section>

          <Section title="10. Autoridade Nacional">
            <p>
              Se você acreditar que seus direitos foram violados, pode registrar uma reclamação
              junto à Autoridade Nacional de Proteção de Dados (ANPD):
            </p>
            <InfoBlock>
              <a
                href="https://www.gov.br/anpd"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#5BBFB5" }}
              >
                www.gov.br/anpd
              </a>
            </InfoBlock>
          </Section>

          <Section title="11. Alterações nesta Política">
            <p>
              Esta Política pode ser atualizada periodicamente. Alterações relevantes serão
              comunicadas por e-mail com antecedência mínima de 7 dias. A versão vigente
              estará sempre disponível nesta página com a data de atualização.
            </p>
          </Section>

          <Section title="12. Contato">
            <InfoBlock>
              <p style={{ margin: 0, color: "#F5F2EE", fontWeight: 600 }}>nota. — Encarregado de Dados (DPO)</p>
              <p style={{ margin: "6px 0 0", color: "#9C9A94", fontSize: 13 }}>
                RRM Consultoria · CNPJ 51.381.377/0001-79
              </p>
              <p style={{ margin: "8px 0 0", color: "#9C9A94", fontSize: 14 }}>
                E-mail:{" "}
                <a href="mailto:nota.privacidade@gmail.com" style={{ color: "#5BBFB5" }}>
                  nota.privacidade@gmail.com
                </a>
              </p>
            </InfoBlock>
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
          <Link href="/termos" style={{ color: "#5BBFB5", fontSize: 13, textDecoration: "none" }}>
            Termos de Uso →
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

function InfoBlock({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#1A1916",
        border: "1px solid #2A2925",
        borderRadius: 10,
        padding: "16px 20px",
        marginTop: 12,
      }}
    >
      {children}
    </div>
  );
}

function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div
      style={{
        overflowX: "auto",
        marginTop: 12,
        borderRadius: 10,
        border: "1px solid #2A2925",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 14,
        }}
      >
        <thead>
          <tr style={{ background: "#1A1916" }}>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  color: "#9C9A94",
                  fontWeight: 500,
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  borderBottom: "1px solid #2A2925",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              style={{ borderBottom: ri < rows.length - 1 ? "1px solid #2A2925" : "none" }}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: "12px 16px",
                    color: ci === 0 ? "#F5F2EE" : "#D4D0C8",
                    verticalAlign: "top",
                    lineHeight: 1.5,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}