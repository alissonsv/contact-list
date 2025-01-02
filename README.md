# Contact List
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

[![Run Unit Tests](https://github.com/alissonsv/contact-list/actions/workflows/run-unit-tests.yml/badge.svg)](https://github.com/alissonsv/contact-list/actions/workflows/run-unit-tests.yml)
[![Run E2E Tests](https://github.com/alissonsv/contact-list/actions/workflows/run-e2e-tests.yml/badge.svg)](https://github.com/alissonsv/contact-list/actions/workflows/run-e2e-tests.yml)

## Como Rodar local

### Docker Compose:
```bash
# Sobe a aplicação com o MySQL
docker compose up

# Remove os containers, imagens e network
docker compose down --rmi all
```

### Terminal:
- __Node v22.X__
- __Garanta que uma instância de MySQL esteja rodando__

```bash
# copie e edite as variáveis de ambiente
cp .env.example .env

# instala as dependências
npm i

# Aplica as migrations e inicia a aplicação
npm run dev
```

## Rotas:
Acessar o Swagger em: http://localhost:3333/api-docs