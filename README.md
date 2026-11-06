# Trilora 1.1 — Organizador acadêmico

Projeto de Engenharia de Software, desenvolvido em HTML, CSS e JavaScript sem frameworks.

## Novidades da versão 1.1

- Código separado em HTML, CSS e módulos JavaScript.
- Edição de tarefas existentes (título, disciplina, prazo e prioridade).
- Busca textual de tarefas, filtro por situação e filtro por disciplina.
- Validação de títulos e datas; prevenção de disciplinas duplicadas.
- Testes automatizados para regras de negócio.
- Compatibilidade com os dados da versão 1.0 armazenados no navegador.

## Estrutura

```text
trilora/
├── index.html                Página principal
├── css/
│   ├── style.css             Estilo da versão inicial
│   └── improvements.css      Melhorias visuais
├── js/
│   ├── app.js                Interface e interações
│   └── data.js               Dados e regras testáveis
├── tests/
│   └── data.test.mjs         Testes automatizados
├── package.json              Configuração dos testes
└── README.md
```

## Como executar

Como a aplicação agora utiliza módulos JavaScript (`type="module"`), rode-a por um servidor HTTP local em vez de abrir o arquivo pelo protocolo `file://`.

No Visual Studio Code, você pode utilizar uma extensão de servidor local como Live Server. Se tiver Python 3 instalado, também pode executar na pasta do projeto:

```bash
python -m http.server 8000
```

Depois, acesse `http://localhost:8000`.

**O GitHub Pages não exige instalação de nada:** ele já disponibiliza os arquivos por HTTP/HTTPS.

## Executar testes

Com Node.js instalado (sem dependências de terceiros):

```bash
npm test
```

Os testes cobrem progresso, filtragem, ordenação, validação, escape de HTML e compatibilidade do armazenamento local.

## Publicar no GitHub Pages

1. Antes de atualizar, guarde uma cópia do repositório atual.
2. Extraia o ZIP da versão 1.1.
3. No repositório `JoabKaimon/trilora`, atualize `index.html` e `README.md`, envie as pastas `css`, `js` e `tests` e o arquivo `package.json`.
4. Confirme que `index.html` continua na raiz do branch `main`.
5. Aguarde a publicação em `https://joabkaimon.github.io/trilora/`.
6. Abra o site e teste a edição, a pesquisa e o calendário.

**Não envie apenas o arquivo ZIP para a raiz do repositório.** O GitHub Pages precisa dos arquivos extraídos. Mantenha os caminhos e nomes das pastas.

## Armazenamento e limitações

O sistema usa a chave `trilora-v1` no `localStorage` e mantém os registros já existentes na mesma origem (endereço web) e navegador. Isso não sincroniza dados entre dispositivos. Se o usuário limpar os dados do site, os registros locais podem ser perdidos. Ainda não há autenticação, banco de dados remoto ou suporte a múltiplos usuários.

O conjunto de demonstração aparece somente quando não existem dados salvos. Os testes automatizados não substituem os testes manuais no navegador.
