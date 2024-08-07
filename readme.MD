<h1 align="center" style="font-weight: bold">api-agency-travel 🚌</h1>

## Descrição 📜

Esse projeto consiste em uma api para uma agência de viagens de ônibus, mostrando todo o processo para efetuar a compra de uma passagem, desde a criação do usuário até a escolha de um destino para viajar. A aplicação faz integração com a api maps do google, onde calcula a duração da viagem, distancia, data/horário de chegada, entre outras informações. As viagens podem ser visualizadas mesmo sem o cadastro, agora para comprar uma passagem, é necesário o login no sistema. A criação, edição ou exclusão das viagens e/ou rodoviárias é feita apenas por usuários administradores (validado através do token jwt). O projeto foi feito utilizando arquitetura limpa e também foram criados testes unitários com o vitest.

## Tecnologias 🖥️

Este projeto está utilizando as seguintes tecnologias:

- [Node.js](https://nodejs.org/en)
- [Express](https://www.expressjs.com/pt-br/)
- [Pg-promise](https://github.com/vitaly-t/pg-promise)
- [Vitest](https://vitest.dev/)
- [JWT](https://jwt.io/)
- [Zod](https://zod.dev/)

## Endpoints 📌

A seguir estão as rotas da aplicação (a maioria só pode ser acessada com a validação do token jwt, além das rotas privadas, que apenas administradores podem acessar):

### Usuário

- **GET** `/users`: lista todos os usuários.
- **GET** `/users/:id`: lista um usuário buscando pelo id.
- **GET** `/users/email?email=`: lista um usuário buscando pelo email (query string).
- **GET** `/users/cpf?cpf=`: lista um usuário buscando pelo cpf (query string).
- **GET** `/users/telephone?telephone=`: lista um usuário buscando pelo telephone (query string).
- **POST** `/users`: cria um novo usuário.
- **POST** `/users/login`: faz o login.
- **PATCH** `/users/:id/name`: atualiza o nome do usuário.
- **PATCH** `/users/:id/telephone`: atualiza o telefone do usuário.
- **PATCH** `/users/:id/password`: atualiza a senha do usuário.
- **DELETE** `/users/:id`: deleta um usuário.

### Rodoviária

- **GET** `/bus-stations`: lista todas as rodoviárias.
- **GET** `/bus-stations/city?city=`: lista as rodoviárias da cidade informada (query string).
- **GET** `/bus-stations/name?name=`: lista uma rodoviária buscando pelo nome.
- **GET** `/bus-stations/:id=`: lista uma rodoviária buscando pelo id.
- **POST** `/bus-stations`: registra uma nova rodoviária.
- **DELETE** `/bus-stations`: deleta uma rodoviária.

### Viagem

- **GET** `/travels`: lista todas as viagens.
- **GET** `/travels/origin?city=`: lista as viagens com origem na cidade informada (query string).
- **GET** `/travels/destination?city=`: lista as viagens com destino na cidade informada (query string).
- **GET** `/travels/date?date=&city=`: lista as viagens com origem na cidade informada em determinada data (query string).
- **GET** `/travels/:id`: lista uma viagem buscando pelo id.
- **POST** `/travels`: cria uma nova viagem.
- **DELETE** `/travels/:id`: deleta uma viagem.

### Passageiro

- **GET** `/passengers`: lista todos os passageiros.
- **GET** `/passengers/:id`: lista um passageiro buscando pelo id.
- **POST** `/passengers`: cria um novo passageiro.
- **DELETE** `/passengers/:id`: deleta um passageiro.

## Como rodar esse projeto? 💿

<h3>Pre-requisitos</h3>

- [Node.js](https://nodejs.org/en)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)
- [Github](https://github.com/)

<h3>Clonagem</h3>

```bash
# clone o repositório
$ git clone https://github.com/bastosmatheus/api-restaurant.git
```

<h3>Configuração do arquivo .env</h3>

```bash
# arquivo .env
DATABASE_URL=postgresql://username:password@localhost:5432/yourdatabase?schema=public
API_KEY=YOUR_API_GOOGLE_KEY
SECRET_KEY=YOUR_SECRET_KEY_JWT
```

<h3>Projeto</h3>

```bash
# depois de clonado, procure a pasta do projeto
$ cd api-agency-travel

# instale todas as dependências
$ npm install

# execute o projeto
$ npm run dev
```
