# API base com banco de dados ORACLE

Este projeto tem como objetivo mostrar a base para se desenvolver uma API

### Baixar

- [Insomnia](https://insomnia.rest/download)

## Configuração do .env

O arquivo `.env` é utilizado para definir variáveis de ambiente.

Dentro do arquivo `.env.example` existe um exemplo de como criar um `.env` para a conexão com o banco de dados, você deve inserir seus dados, copiar e criar um `.env` no root do projeto (caso não tenha alterado o nome da pasta será basic.node.application).

## Banco de dados Remoto

Baixar:
- [Oracle Instant Client](https://www.oracle.com/br/database/technologies/instant-client/winx64-64-downloads.html)

O Oracle Instant Client deve ser extraído em C:\oracle, caso não tenha uma pasta oracle no C: basta criá-la. O path deverá ficar parecido com esse: `C:\oracle\instantclient_21_7`

Após esse procedimento você deve adicionar essa rota à variável de ambiente PATH da sua máquina. No Windows:

- Pesquise por `Editar as variáveis de ambiente do sistema` caso não seja administrador pesquise por `Editar as variáveis de ambiente para sua conta`
- Copie o caminho até o instant client. Ex: `C:\oracle\instantclient_21_7`
- Em Variáveis de usuário para *nome da sua máquina* procure por PATH
- Clique nela e clique em **editar**
- Clique em novo e cole o caminho até o *oracle instant client*

Com isso estamos prontos para desenvolver!

Caso dê algum erro:
- Reinicie todos os consoles abertos e editores de código antes da adição do *oracle instant client* no *PATH*

## Seção dedicada a estudantes da PUCC

Para realizar a conexão com o banco de dados da PUC você deve baixar os seguintes items:
- [Fortinet VPN](https://www.fortinet.com/br/support/product-downloads) (CASO NÃO ESTEJA EM UMA MÁQUINA DA PUCC)

Você deve conectar a VPN com a PUCC.

## Alguns comandos a serem feitos

`npm install` para instalar dependências (express, nodemon, oracledb, dotenv).

`node src\migrations\users.migration.js` para gerar a tabela no banco de dados.
`node src\migrations\users.rollback.migration.js` *CASO PRECISE DELETAR A TABELA DO BANCO*

Para rodar o `Nodemon` você deve abrir Windows Power Shell como Administrador e rodar `Set-ExecutionPolicy Unrestricted` e selecionar a opção `A`.

Para rodar o projeto em sí `npm run dev` ou `nodemon src/app.js`

## Para testar as rotas você pode usar o Insomnia

Esse é um bom vídeo para você [aprender](https://www.youtube.com/watch?v=gLpw0GSDYaw&ab_channel=OmniLabs) a usar o Insomnia.