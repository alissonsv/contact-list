import { z } from "zod";

import { IGroupRepository } from "#/domain/interfaces/group-repository";
import { ValidationError } from "#/data/errors/validation-error";
import { ResourceNotFoundError } from "#/data/errors/resource-not-found-error";

interface ReadGrupoUsecaseResponse {
  id: number;
  nome: string;
}

export class ReadGrupoUsecase {
  constructor(private groupRepository: IGroupRepository) {}

  async execute(grupoId: number): Promise<ReadGrupoUsecaseResponse> {
    const grupoIdSchema = z.number();

    const parsedGrupoIdSchema = grupoIdSchema.safeParse(grupoId);

    if (!parsedGrupoIdSchema.success) {
      throw new ValidationError("grupoId deve ser um número!");
    }

    const grupo = await this.groupRepository.read(grupoId);

    if (!grupo) {
      throw new ResourceNotFoundError();
    }

    return grupo;
  }
}
