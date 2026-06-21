# Fluig React Widget Boilerplate

Este projeto é o **boilerplate definitivo para criação de Super Widgets no TOTVS Fluig**, construído com uma arquitetura moderna focada em Single Page Applications (SPA). Ele utiliza **React**, **TypeScript**, **Tailwind CSS** e **Vite**, com o empacotamento 100% automatizado para o Fluig gerenciado pelo **Maven**.

Com esta estrutura, você tem desenvolvimento local super rápido (Hot Reloading), simulação avançada das APIs do Fluig (`SuperWidget`, `WCMSpaceAPI`), ofuscação de código e geração de um pacote `.war` extremamente enxuto contendo apenas 1 arquivo JS e 1 arquivo CSS dinâmicos.

## 🚀 Tecnologias Utilizadas

- **Frontend:** React 18, React Router DOM, TypeScript, Tailwind CSS, PostCSS.
- **Build Tool (Frontend):** Vite.
- **Ofuscação:** O código é fortemente ofuscado no momento do build utilizando o `vite-plugin-javascript-obfuscator` para dificultar engenharia reversa.
- **Backend/Empacotamento:** Maven (com `frontend-maven-plugin` para executar tarefas do Node e `maven-war-plugin` para gerar o `.war`).

## 📁 Estrutura do Projeto

O código-fonte principal do frontend em React está localizado em `src/react/`. Durante o build, o Vite compila o código e injeta os arquivos gerados (bundle) na estrutura de recursos da webapp da widget (`src/main/webapp/resources/`).

O projeto usa o alias `@/` para simplificar as importações que apontam para o diretório `src/react/`.

## 🛠️ Como Executar e Desenvolver

### Pré-requisitos
- Node.js
- NPM
- Maven
- JDK (Java)

### Ambiente de Desenvolvimento Local

Para desenvolver o frontend isoladamente com Hot Module Replacement (HMR) e recarregamento rápido, utilize o Vite:

1. Instale as dependências do frontend (apenas na primeira vez ou quando mudar o `package.json`):
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   > **Nota:** O `vite.config.ts` possui um proxy configurado para direcionar chamadas `/api` para a URL do seu Fluig (pode ser configurada através da variável de ambiente `FLUIG_URL` ou usando `http://localhost:8080` por padrão).

### Build e Empacotamento para o Fluig

Para gerar o arquivo `.war` que será feito o deploy na plataforma TOTVS Fluig:

Execute o comando Maven na raiz do projeto:
```bash
mvn clean install
```

O Maven cuidará de todo o processo de forma automatizada:
1. Instalará a versão correta do Node.js e NPM (via `frontend-maven-plugin`).
2. Executará o `npm install` e, em seguida, `npm run build` para compilar o React via Vite.
3. Converterá as propriedades de internacionalização (i18n) de UTF-8 para ASCII utilizando o `native2ascii-maven-plugin`.
4. O `maven-war-plugin` montará o arquivo `.war`, **excluindo** arquivos desnecessários (como pastas `node_modules`, fontes do React `src/react/`, arquivos de configuração do frontend, etc.) para manter o pacote leve para o servidor JBoss/Wildfly do Fluig.

O arquivo resultante estará disponível de forma limpa na pasta `dist/` (ex: `dist/MyWidget2.war`).

## 🔒 Segurança e Ofuscação

O Vite está configurado para ofuscar o código gerado em ambiente de produção (build). As principais opções aplicadas são:
- Conversão de nomes de variáveis/funções (Hexadecimal).
- Divisão de strings e ocultação em arrays criptografados.
- Quebra de fluxo lógico (Control Flow Flattening).
- Injeção de código morto (Dead Code Injection) para confundir.
- Proteção contra embelezadores de código (Self-Defending).
- Remoção de todos os `console.log`.

Essas configurações garantem maior segurança da propriedade intelectual de sua aplicação frontend quando exposta no navegador.

### Desativando a Minificação e Ofuscação

Em alguns casos (como depuração avançada ou auditoria interna), pode ser necessário desativar a ofuscação e a minificação do código. Para isso, você pode definir a variável de ambiente `DISABLE_SECURITY` como `true` antes de executar o build.

**Opção 1: Usando o arquivo `.env.local` (Recomendado)**
Como o Vite carrega automaticamente os arquivos de ambiente, você pode simplesmente adicionar ou alterar a seguinte linha no seu arquivo `.env.local`:
```env
DISABLE_SECURITY=true
```

**Opção 2: Passando via terminal**
No terminal Linux/Mac:
```bash
DISABLE_SECURITY=true npm run build
# ou
DISABLE_SECURITY=true mvn clean install
```
No Windows (PowerShell):
```powershell
$env:DISABLE_SECURITY="true"; mvn clean install
```
