import { z } from "zod";

import { ValidationError } from "#/data/errors/validation-error";
import { IGroupRepository } from "#/domain/interfaces/group-repository";

interface CreateGrupoUsecaseRequest {
  nome: string;
}

interface CreateGrupoUsecaseResponse {
  id: number;
  nome: string;
}

export class CreateGrupoUsecase {
  constructor(private groupRepository: IGroupRepository) {}

  async execute(
    data: CreateGrupoUsecaseRequest,
  ): Promise<CreateGrupoUsecaseResponse> {
    const grupoSchema = z.object({
      nome: z.string().nonempty(),
    });

    const parsedGrupoSchema = grupoSchema.safeParse(data);

    if (!parsedGrupoSchema.success) {
      throw new ValidationError(
        JSON.stringify(parsedGrupoSchema.error.flatten().fieldErrors),
      );
    }

    const { nome } = parsedGrupoSchema.data;

    return this.groupRepository.create({ nome });
  }
}
