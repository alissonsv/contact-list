import { ResourceAlreadyExistsError } from "#/data/errors/resource-already-exists-error";
import { ValidationError } from "#/data/errors/validation-error";
import { CreateContatoUsecase } from "#/data/usecases/create-contato-usecase";
import { GetContatosUsecase } from "#/data/usecases/get-contatos-usecase";
import { PrismaContactRepository } from "#/infra/repositories/prisma-contact-repository";
import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  const contatoRepository = new PrismaContactRepository();
  const createContatoUseCase = new CreateContatoUsecase(contatoRepository);

  try {
    await createContatoUseCase.execute(req.body);

    return res.status(201).send();
  } catch (err) {
    if (
      err instanceof ValidationError ||
      err instanceof ResourceAlreadyExistsError
    ) {
      return res.status(400).json({ message: err.message });
    }

    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  const contatoRepository = new PrismaContactRepository();
  const getContatosUsecase = new GetContatosUsecase(contatoRepository);

  const page = Number(req.query.page) || 1;

  try {
    const contatos = await getContatosUsecase.execute(page);
    return res.json(contatos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
