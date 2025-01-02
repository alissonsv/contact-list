import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "#/presentation/http/swagger.json";

import contatosRouter from "#/presentation/http/contatos/routes";
import grupoRouter from "#/presentation/http/grupo/routes";
import relatorioRouter from "#/presentation/http/relatorio/routes";

export const app = express();

app.use(express.json());
app.use("/contatos", contatosRouter);
app.use("/grupos", grupoRouter);
app.use("/relatorio", relatorioRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
