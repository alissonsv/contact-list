import { Contato } from "@prisma/client";
import { z } from "zod";
import { ValidationError } from "../errors/validation-error";
import { IContactRepository } from "#/domain/interfaces/contact-repository";

export class UpdateContatoUsecase {
  constructor(private readonly contatoRepository: IContactRepository) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async execute(idToBeUpdated: any, data: any): Promise<Contato> {
    const idSchema = z.coerce.number({ message: "id deve ser um número" });
    const parsedId = idSchema.safeParse(idToBeUpdated);

    if (!parsedId.success) {
      throw new ValidationError(
        JSON.stringify(parsedId.error.flatten().fieldErrors),
      );
    }

    const contatoSchema = z.object({
      nome: z.string().refine((str) => str.trim().split(/\s+/).length >= 2, {
        message: "Nome deve conter no mínimo 2 palavras",
      }),
      telefone: z.string().regex(/^\d{10}$/, "Telefone deve conter 10 dígitos"),
    });

    const parsedContatoSchema = contatoSchema.safeParse(data);

    if (!parsedContatoSchema.success) {
      throw new ValidationError(
        JSON.stringify(parsedContatoSchema.error.flatten().fieldErrors),
      );
    }

    const { nome, telefone } = parsedContatoSchema.data;
    const id = parsedId.data;

    return this.contatoRepository.update({
      id,
      nome,
      telefone,
    });
  }
}
