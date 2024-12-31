import express from "express";
import contatosRouter from "#/presentation/http/contatos/routes";
import grupoRouter from "#/presentation/http/grupo/routes";

export const app = express();

app.use(express.json());
app.use("/contatos", contatosRouter);
app.use("/grupos", grupoRouter);
