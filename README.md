# Contact List

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