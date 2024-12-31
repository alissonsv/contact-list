import { Router } from "express";

import { CreateGrupoUsecase } from "#/data/usecases/grupo/create-grupo-usecase";
import { PrismaGroupRepository } from "#/infra/repositories/prisma-group-repository";
import { ValidationError } from "#/data/errors/validation-error";
import { ResourceAlreadyExistsError } from "#/data/errors/resource-already-exists-error";
import { ReadGrupoUsecase } from "#/data/usecases/grupo/read-grupo-usecase";
import { ResourceNotFoundError } from "#/data/errors/resource-not-found-error";

const router = Router();

router.post("/", async (req, res) => {
  const groupRepository = new PrismaGroupRepository();
  const createGroupRepository = new CreateGrupoUsecase(groupRepository);

  try {
    const grupo = await createGroupRepository.execute(req.body);
    return res.status(201).send(grupo);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ message: err.message });
    }

    if (err instanceof ResourceAlreadyExistsError) {
      return res.status(409).json({ message: err.message });
    }

    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const groupRepository = new PrismaGroupRepository();
  const readGrupoUsecase = new ReadGrupoUsecase(groupRepository);

  try {
    const grupo = await readGrupoUsecase.execute(Number(req.params.id));

    return res.status(200).json(grupo);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ message: err.message });
    }

    if (err instanceof ResourceNotFoundError) {
      return res.status(404).json({ message: err.message });
    }

    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
