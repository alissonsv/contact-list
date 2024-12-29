import express from "express";
import contatosRouter from "#/presentation/http/contatos/routes";

export const app = express();

app.use(express.json());
app.use("/contatos", contatosRouter);
