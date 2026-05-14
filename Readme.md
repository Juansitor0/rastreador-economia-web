# 🏍️ Rastreador de Economia - Moto

Uma aplicação web interativa e moderna para rastrear seu progresso na economia para compra de moto. Acompanhe cada depósito, calcule parcelamentos e visualize sua jornada até o objetivo!

## ✨ Funcionalidades

- **Dashboard Intuitivo**: Visualize seu saldo atual, meta, progresso e data estimada em um só lugar
- **Timeline de Depósitos**: Acompanhe todos os depósitos realizados e projetados
- **Histórico de Transações**: Registre depósitos e saques com descrições personalizadas
- **Gerenciador de Salário**: Controle sua base salarial (salário base, 13º, PPR, bônus)
- **Calculadora de Parcelamento**: Simule como financiar sua moto com diferentes parcelas
- **Milestones e Alertas**: Receba notificações ao atingir marcos importantes
- **Cálculos Automáticos**: Projeção automática de quando você atingirá sua meta
- **Armazenamento Local**: Seus dados são salvos automaticamente no navegador
- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile

## 🚀 Tecnologias

- **React 18** - Biblioteca UI moderna
- **TypeScript** - Tipagem estática para maior segurança
- **Vite** - Build tool rápido e eficiente
- **TailwindCSS** - Estilização com utility-first CSS
- **Shadcn/ui** - Componentes UI de alta qualidade
- **Lucide Icons** - Ícones minimalistas e modernos
- **nanoid** - Geração de IDs únicos

## 📋 Pré-requisitos

- Node.js 18+ 
- pnpm (recomendado) ou npm

## 🔧 Instalação

1. **Clone o repositório:**
   \`\`\`bash
   git clone https://github.com/Juansitor0/rastreador-economia-web.git
   cd rastreador-economia-web
   \`\`\`

2. **Instale as dependências:**
   \`\`\`bash
   pnpm install
   \`\`\`

3. **Inicie o servidor de desenvolvimento:**
   \`\`\`bash
   pnpm dev
   \`\`\`

4. **Acesse a aplicação:**
   Abra seu navegador e vá para \`http://localhost:5173\`

## 📦 Build para Produção

Para criar uma versão otimizada para produção:

\`\`\`bash
pnpm build
\`\`\`

Os arquivos compilados estarão na pasta \`dist/\`.

## 🎨 Estrutura do Projeto

\`\`\`
rastreador-economia-web/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── hooks/         # Custom hooks
│   │   ├── contexts/      # Context API
│   │   ├── lib/           # Utilitários
│   │   └── App.tsx        # Componente raiz
│   └── index.html
├── server/                # Backend (se necessário )
├── shared/                # Código compartilhado
├── package.json
├── vite.config.ts
└── tsconfig.json
\`\`\`

## 🎯 Como Usar

### 1. Configurar Valores Iniciais
Clique em **Configurações** para definir:
- Saldo inicial
- Meta de economia
- Depósitos mensais (períodos diferentes)

### 2. Registrar Transações
Na aba **Transações**, adicione:
- Depósitos realizados
- Saques (se houver)
- Descrições personalizadas

### 3. Acompanhar Progresso
No **Dashboard**, veja:
- Saldo atual
- Percentual de progresso
- Data estimada para atingir a meta
- Timeline dos próximos depósitos

### 4. Simular Parcelamento
Na aba **Parcelamento**, calcule:
- Valor das parcelas
- Número de meses
- Juros (se aplicável)

## 💾 Armazenamento de Dados

A aplicação usa **localStorage** do navegador para armazenar:
- Saldo inicial
- Meta de economia
- Histórico de transações
- Informações de salário
- Depósitos mensais

**Nota:** Os dados são armazenados localmente. Fazer backup é recomendado.

## 🎨 Design

O projeto segue a abordagem de **Minimalismo Funcional com Foco em Dados**:
- Paleta neutra com acentos verdes (progresso)
- Hierarquia visual clara
- Tipografia profissional
- Animações suaves e intuitivas
- Foco em usabilidade

Veja \`ideas.md\` para detalhes sobre as abordagens de design consideradas.

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit suas mudanças (\`git commit -m 'Add some AmazingFeature'\`)
4. Push para a branch (\`git push origin feature/AmazingFeature\`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo \`LICENSE\` para mais detalhes.

## 👤 Autor

**Juan Sitor**
- GitHub: [@Juansitor0](https://github.com/Juansitor0 )

## 🐛 Reportar Bugs

Encontrou um bug? Abra uma [issue](https://github.com/Juansitor0/rastreador-economia-web/issues ) no GitHub.

## 💡 Sugestões e Melhorias

Tem uma ideia para melhorar o projeto? Abra uma [discussion](https://github.com/Juansitor0/rastreador-economia-web/discussions ) ou uma issue com o label \`enhancement\`.

## 🎉 Agradecimentos

- Inspirado em ferramentas de planejamento financeiro
- Componentes UI de [shadcn/ui](https://ui.shadcn.com/ )
- Ícones de [Lucide](https://lucide.dev/ )

---

**Boa sorte na sua jornada para comprar sua moto! 🏍️**
\`\`\`

---

## 📄 Arquivo 2: LICENSE

Crie um arquivo chamado **LICENSE** na raiz do seu repositório com o seguinte conteúdo:

\`\`\`
MIT License

Copyright (c) 2026 Juan Sitor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

---

## 📝 Como Adicionar os Arquivos

**Opção 1: Via GitHub Web Interface (Mais Fácil)**

1. Vá para https://github.com/Juansitor0/rastreador-economia-web
2. Clique em **"Add file"** → **"Create new file"**
3. No campo de nome, digite **README.md**
4. Cole o conteúdo do README.md acima
5. Clique em **"Commit changes"**
6. Repita o processo para o arquivo **LICENSE**

**Opção 2: Via Git (Sua Máquina )**

1. Clone o repositório:
   \`\`\`bash
   git clone https://github.com/Juansitor0/rastreador-economia-web.git
   cd rastreador-economia-web
   \`\`\`

2. Crie os arquivos com os conteúdos acima

3. Faça commit e push:
   \`\`\`bash
   git add README.md LICENSE
   git commit -m "docs: Add comprehensive README and MIT LICENSE"
   git push origin master
   \`\`\`

Pronto! Seu repositório estará completo e profissional! 🎉
