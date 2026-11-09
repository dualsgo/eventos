# 🎟️ Ferramentas de Impressão Térmica & Eventos Ri Happy (`eventos`)

Aplicação web em **Next.js 15 + React 18 + TypeScript** projetada para criação, personalização e impressão em **impressoras térmicas de balcão (80mm)** de **Ingressos de Eventos de Loja, Selos de Troca, Cupons de Desconto e Convites para Pesquisa de Satisfação (NPS)** da **Ri Happy**.

---

## 🚀 Principais Módulos de Impressão

1. **🎈 Eventos e Ativações em Loja (`event-form.tsx` & `print-preview.tsx`)**:
   - Criação de convites e vouchers para eventos infantis e oficinas na loja com data, horário, título, descrição, loja selecionada (`src/data/stores.ts`) e elementos gráficos temáticos (`public/assets/`).
2. **🔄 Selo de Troca (`exchange-seal.tsx`)**:
   - Emissão rápida de etiquetas/selos de troca padronizados com código da loja, data e prazo legal/comercial de troca.
3. **💸 Cupom de Desconto / Campanha (`discount-coupon.tsx`)**:
   - Geração de vouchers promocionais personalizados para ações locais de fidelização.
4. **⭐ Convite para Pesquisa de Satisfação (`survey-invite-coupon.tsx`)**:
   - Impressão de lembretes térmicos convidando o cliente a avaliar o atendimento da loja.

---

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 15 (Turbopack), React 18, TypeScript 5
- **UI & Design**: Tailwind CSS, Radix UI / shadcn/ui, Lucide React
- **Validação & Datas**: React Hook Form, Zod, `date-fns`
- **Otimização de Impressão**: CSS `@media print` calibrado para bobinas térmicas de 80mm (`print-container.tsx`)

---

## 📂 Estrutura do Projeto

```text
eventos/
├── docs/
│   └── blueprint.md                # Especificação visual original
├── public/
│   └── assets/                     # Ilustrações e mascotes para impressão térmica
├── src/
│   ├── app/                        # Página principal com abas para cada ferramenta térmica
│   ├── components/
│   │   ├── discount-coupon.tsx     # Gerador de Cupom de Desconto
│   │   ├── event-form.tsx          # Formulário de Eventos
│   │   ├── exchange-seal.tsx       # Gerador de Selo de Troca
│   │   ├── print-container.tsx     # Container calibrado para impressora térmica
│   │   ├── print-preview.tsx       # Pré-visualização de evento
│   │   ├── survey-invite-coupon.tsx# Gerador de convite de pesquisa
│   │   └── ui/                     # Componentes base shadcn/ui
│   └── data/
│       └── stores.ts               # Cadastro de lojas Ri Happy
└── package.json
```

---

## 💻 Como Executar

```bash
# Instalar dependências
npm install

# Iniciar ambiente de desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```
