import { Router } from "express";

import { CreateGrupoUsecase } from "#/data/usecases/grupo/create-grupo-usecase";
import { PrismaGroupRepository } from "#/infra/repositories/prisma-group-repository";
import { ValidationError } from "#/data/errors/validation-error";
import { ResourceAlreadyExistsError } from "#/data/errors/resource-already-exists-error";

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

export default router;
