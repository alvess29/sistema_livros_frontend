# Biblioteca (front-end)

Front-end Angular do sistema de cadastro de livros, escrito em TypeScript. Consome a API Spring Boot, que fica em um repositório separado.

## Equipe

### Pedro Roberto Ferreira de Lima

Fluxo principal da aplicação, tela de livros e comunicação com a API.

- Login (`pages/login`):
  - campo com o nome do leitor, aceito também com Enter;
  - botão desabilitado enquanto o nome estiver vazio;
  - guarda o nome em `sessionStorage` e redireciona para `/home`.
- Rotas e configuração (`app.routes.ts` e `app.config.ts`): `/` redireciona para `/login`, rotas de `login` e `home`, e provedores de rota e de `HttpClient`.
- Tela principal (`pages/home/home.ts` e `home.html`):
  - carregamento da lista de livros ao abrir a tela;
  - contador de livros no acervo, saudação com o nome do usuário e botão Sair, que limpa a sessão;
  - busca por título ou autor e filtro por gênero, combinados em `livrosFiltrados`.
- Formulário lateral de livros:
  - cadastro e edição, usando `POST` ou `PUT` conforme o caso;
  - campos obrigatórios, limite de tamanho e contador da descrição (até 500 caracteres);
  - cancelar e limpar o formulário.
- Exclusão com confirmação do usuário.
- Mensagens de erro quando a API falha ao listar, salvar ou excluir.
- `ServiceHome` (`pages/home/service.ts`): chamadas `listar`, `salvar`, `atualizar` e `excluir`, e o modelo `Livro` (`model.ts`).
- Testes de `home.spec.ts` e `login.spec.ts`.

### Filipe José Ribeiro Silva

Capa dos livros, componente de botão e identidade visual.

- Capa (`pages/home/imagem.ts` e formulário):
  - compressão da imagem no navegador, com no máximo 480 px de lado e JPEG com qualidade 0,8, reduzida em etapas até caber em 150 mil caracteres, com mínimo de 120 px;
  - validação de que o arquivo escolhido é uma imagem;
  - prévia, troca e remoção da capa no formulário;
  - exibição da capa nos cartões dos livros, ou da inicial do título quando não há imagem.
- Componente `button` (`components/button`): entradas `textButton`, `size` e `disabled`, estilos e `button.spec.ts`.
- Estilos e identidade visual: `styles.css`, `home.css` e `login.css`, incluindo a estante em blocos de pixel art e a lanterna da tela de login.

## Tecnologias

| Tecnologia | Versão | Uso |
| --- | --- | --- |
| Angular | ^22.2.0 | Framework da interface, com rotas e formulários |
| TypeScript | ~6.0.2 | Linguagem do front-end |
| RxJS | ~7.8.0 | Chamadas HTTP como fluxos observáveis |
| Vitest | ^5.0.0 | Testes automatizados |
| npm | 12.2.0 | Gerenciador de pacotes, definido em `packageManager` |
| Node.js | 24.21.0 | Versão usada pela equipe no desenvolvimento |

## Pré-requisitos

- Node.js 24.21.0 com npm
- Back-end da Biblioteca em execução em `http://localhost:8080`

## Como executar

Suba primeiro o back-end, seguindo o README do repositório dele. Depois, na pasta do projeto:

```bash
npm install
npm start
```

Abra `http://localhost:4200/`. A tela de login apenas guarda o nome informado na sessão do navegador.

A URL da API está em `src/app/pages/home/service.ts` (`http://localhost:8080/livros`).

## Testes

```bash
npm test
```

## Estrutura

| Pasta | Conteúdo |
| --- | --- |
| `src/app/pages/login` | Tela de login |
| `src/app/pages/home` | Tela principal: listagem, filtros, formulário, serviço HTTP, modelo `Livro` e compressão de imagem |
| `src/app/components/button` | Botão reutilizável |

## Repositório do back-end

A API Spring Boot que este projeto consome fica em outro repositório: https://github.com/alvess29/sistema_livros_backend.
