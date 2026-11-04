# Trilora — Protótipo de organização acadêmica

Projeto inicial para a disciplina de Engenharia de Software.

## Como executar

1. Extraia o arquivo ZIP.
2. Abra `index.html` no navegador (Chrome, Edge ou Firefox).
3. Teste o cadastro de disciplinas, a inclusão e conclusão de tarefas e o calendário.

Não é necessário instalar dependências, conectar à internet nem configurar banco de dados.

## Onde está o código?

Toda a primeira versão está em `index.html`:

- **HTML**: estrutura da página (início e final do arquivo).
- **CSS**: regras visuais entre `<style>` e `</style>`.
- **JavaScript**: funcionalidades entre `<script>` e `</script>`.

Abra o arquivo no Visual Studio Code para ler e modificar. É um protótipo funcional, ainda não uma arquitetura de produção. Na próxima etapa, recomenda-se separar HTML, CSS e JavaScript em arquivos, adicionar testes e um back-end.

## Regras atuais

- Uma tarefa pertence a uma disciplina, tem título, prazo, prioridade e estado de conclusão.
- Uma disciplina com tarefas relacionadas não pode ser excluída diretamente.
- O progresso corresponde à proporção de tarefas concluídas.
- O estado é persistido somente no navegador via `localStorage`, usando a chave `trilora-v1`.
- O conjunto de demonstração é carregado no primeiro acesso.

## Limitações importantes

- Não há login nem sincronização entre dispositivos.
- Não há banco de dados remoto, API ou acesso multiusuário.
- Os dados podem desaparecer se o armazenamento do navegador for apagado.
- Não utilizar dados pessoais sensíveis nesta versão.

## Como publicar em hospedagem independente

**GitHub Pages:** crie um repositório público, envie `index.html` para a raiz, acesse Settings > Pages e selecione *Deploy from a branch* com a branch `main` e a pasta `/ (root)`. O endereço normalmente segue o padrão `usuario.github.io/nome-do-repositorio/`.

**Netlify:** envie a pasta contendo `index.html` pela opção de deploy manual. A hospedagem atribuirá um endereço `*.netlify.app`, personalizável conforme a disponibilidade.

Antes de tornar o repositório público, revise o código e remova qualquer informação privada. Este pacote não contém credenciais.
