# 🧠 Caminho da Palavra - Quiz Interativo com IA
# 🚧 Status: Em desenvolvimento (Refatorando a integração com os endpoints da API do Gemini).

Uma aplicação web interativa de perguntas e respostas (quiz) desenvolvida para testar conhecimentos de forma dinâmica. O grande diferencial deste projeto é a integração com a **API do Google Gemini**, que gera perguntas exclusivas e dinâmicas, fugindo de bancos de dados estáticos tradicionais.

## 🎯 Destaques e Funcionalidades
* **Geração Dinâmica de Conteúdo:** Integração via prompt engineering com o modelo LLM do Google Gemini para criar desafios únicos a cada rodada.
* **Autenticação e Banco de Dados:** Sistema de login de usuários e armazenamento de pontuações/ranking utilizando Firebase (Authentication e Firestore).
* **Modo Desafio:** Implementação de regras de negócio de software, incluindo cronômetro (timed run) e sistema de pontuação progressiva.

## 🛠️ Tecnologias Utilizadas
* **Frontend:** React.js
* **Backend:** Node.js
* **Banco de Dados & Auth:** Firebase (Firestore)
* **Inteligência Artificial:** Google Gemini API (LLM)

## 🚀 Como executar o projeto localmente

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/Lincolnmb94/caminho-da-palavra.git
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto e adicione suas credenciais do Firebase e a chave da API do Gemini:
\`\`\`env
REACT_APP_FIREBASE_API_KEY=sua_chave_aqui
REACT_APP_GEMINI_API_KEY=sua_chave_aqui
\`\`\`

4. Inicie a aplicação:
\`\`\`bash
npm start
\`\`\`
