import { ValidationError } from "#/data/errors/validation-error";
import { IContactGroupRepository } from "#/domain/interfaces/contact-group-repository";
import { Contato } from "@prisma/client";
import { z } from "zod";

export class ListContatosFromGrupoUsecase {
  constructor(private contactGroupRepository: IContactGroupRepository) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async execute(id: any, page: number): Promise<Contato[]> {
    const parsedGrupoId = z.coerce
      .number()
      .int({ message: "grupoId deve ser um número inteiro" })
      .safeParse(id);

    if (!parsedGrupoId.success) {
      throw new ValidationError(
        JSON.stringify(parsedGrupoId.error.flatten().fieldErrors),
      );
    }

    const grupoId = parsedGrupoId.data;

    return this.contactGroupRepository.listGroupContacts(grupoId, page);
  }
}
