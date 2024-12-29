import { ResourceAlreadyExistsError } from "#/data/errors/resource-already-exists-error";
import { ValidationError } from "#/data/errors/validation-error";
import { CreateContatoUsecase } from "#/data/usecases/create-contato-usecase";
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

export default router;
