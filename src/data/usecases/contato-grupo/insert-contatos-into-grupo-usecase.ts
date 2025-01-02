import { ValidationError } from "#/data/errors/validation-error";
import { IContactGroupRepository } from "#/domain/interfaces/contact-group-repository";
import { z } from "zod";

interface InsertContatosIntoGrupoUsecaseRequest {
  contatoIds: number | number[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  grupoId: any;
}

export class InsertContatosIntoGrupoUsecase {
  constructor(private contactGroupRepository: IContactGroupRepository) {}

  async execute(data: InsertContatosIntoGrupoUsecaseRequest): Promise<void> {
    const parsedContatoIdsSchema = z
      .union([z.number().int(), z.array(z.number().int())], {
        message:
          "contatoIds deve ser um número ou um array de números inteiros",
      })
      .transform((value) => (Array.isArray(value) ? value : [value]))
      .safeParse(data.contatoIds);

    if (!parsedContatoIdsSchema.success) {
      throw new ValidationError(
        JSON.stringify(parsedContatoIdsSchema.error.flatten().fieldErrors),
      );
    }

    const parsedGrupoId = z.coerce
      .number()
      .int({ message: "grupoId deve ser um número inteiro" })
      .safeParse(data.grupoId);

    if (!parsedGrupoId.success) {
      throw new ValidationError(
        JSON.stringify(parsedGrupoId.error.flatten().fieldErrors),
      );
    }

    const contatoIds = parsedContatoIdsSchema.data;
    const grupoId = parsedGrupoId.data;

    if (contatoIds.length === 0) {
      return;
    }

    return this.contactGroupRepository.insertContactsIntoGroup(
      contatoIds,
      grupoId,
    );
  }
}
