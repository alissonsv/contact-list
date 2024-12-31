import { z } from "zod";

import { ValidationError } from "#/data/errors/validation-error";
import { IGroupRepository } from "#/domain/interfaces/group-repository";

export class DeleteGrupoUsecase {
  constructor(private groupRepository: IGroupRepository) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async execute(idToBeDeleted: any): Promise<void> {
    const idSchema = z.coerce.number({ message: "id deve ser um número" });
    const parsedId = idSchema.safeParse(idToBeDeleted);

    if (!parsedId.success) {
      throw new ValidationError(
        JSON.stringify(parsedId.error.flatten().fieldErrors),
      );
    }

    const id = parsedId.data;

    await this.groupRepository.deleteById(id);
  }
}
