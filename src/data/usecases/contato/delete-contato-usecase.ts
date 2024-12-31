import { z } from "zod";

import { ValidationError } from "#/data/errors/validation-error";
import { IContactRepository } from "#/domain/interfaces/contact-repository";

export class DeleteContatoUsecase {
  constructor(private readonly contatoRepository: IContactRepository) {}

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

    await this.contatoRepository.deleteById(id);
  }
}
