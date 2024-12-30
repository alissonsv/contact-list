import { ResourceAlreadyExistsError } from "#/data/errors/resource-already-exists-error";
import { ResourceNotFoundError } from "#/data/errors/resource-not-found-error";
import { ValidationError } from "#/data/errors/validation-error";
import { CreateContatoUsecase } from "#/data/usecases/create-contato-usecase";
import { DeleteContatoUsecase } from "#/data/usecases/delete-contato-usecase";
import { GetContatosUsecase } from "#/data/usecases/get-contatos-usecase";
import { UpdateContatoUsecase } from "#/data/usecases/update-contato-usecase";
import { PrismaContactRepository } from "#/infra/repositories/prisma-contact-repository";
import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  const contatoRepository = new PrismaContactRepository();
  const createContatoUseCase = new CreateContatoUsecase(contatoRepository);

  try {
    const contato = await createContatoUseCase.execute(req.body);

    return res.status(201).json(contato);
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

router.patch("/:id", async (req, res) => {
  const contatoRepository = new PrismaContactRepository();
  const updateContatoUseCase = new UpdateContatoUsecase(contatoRepository);

  try {
    const updateContact = await updateContatoUseCase.execute(
      req.params.id,
      req.body,
    );

    return res.status(200).json(updateContact);
  } catch (err) {
    if (
      err instanceof ResourceNotFoundError ||
      err instanceof ResourceAlreadyExistsError ||
      err instanceof ValidationError
    ) {
      return res.status(400).json({ message: err.message });
    }

    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const contatoRepository = new PrismaContactRepository();
  const deleteContatoUseCase = new DeleteContatoUsecase(contatoRepository);

  try {
    await deleteContatoUseCase.execute(req.params.id);

    return res.status(204).json({ message: "Contato deletado com sucesso" });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return res.status(404).json({ message: err.message });
    }

    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
