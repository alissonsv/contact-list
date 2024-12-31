import { z } from "zod";

import { ValidationError } from "#/data/errors/validation-error";
import { IGroupRepository } from "#/domain/interfaces/group-repository";

interface UpdateGrupoUsecaseRequest {
  id: number;
  nome: string;
}

interface UpdateGrupoUsecaseResponse {
  id: number;
  nome: string;
}

export class UpdateGrupoUsecase {
  constructor(private groupRepository: IGroupRepository) {}

  async execute(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    idToBeUpdated: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
  ): Promise<UpdateGrupoUsecaseResponse> {
    const idSchema = z.coerce.number({ message: "id deve ser um número" });
    const parsedId = idSchema.safeParse(idToBeUpdated);

    if (!parsedId.success) {
      throw new ValidationError(
        JSON.stringify(parsedId.error.flatten().fieldErrors),
      );
    }

    const grupoSchema = z.object({
      nome: z
        .string()
        .nonempty({ message: "Nome deve ser uma string válida!" }),
    });

    const parsedGrupoSchema = grupoSchema.safeParse(data);

    if (!parsedGrupoSchema.success) {
      throw new ValidationError(
        JSON.stringify(parsedGrupoSchema.error.flatten().fieldErrors),
      );
    }

    const id = parsedId.data;
    const { nome } = parsedGrupoSchema.data;

    return this.groupRepository.update({ id, nome });
  }
}
