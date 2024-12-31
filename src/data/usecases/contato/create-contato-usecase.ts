import { z } from "zod";

import { ValidationError } from "#/data/errors/validation-error";
import { IContactRepository } from "#/domain/interfaces/contact-repository";

interface CreateContatoUsecaseRequest {
  nome: string;
  telefone: string;
}

interface CreateContatoUsecaseResponse {
  id: number;
  nome: string;
  telefone: string;
}

export class CreateContatoUsecase {
  constructor(private contatoRepository: IContactRepository) {}

  async execute(
    data: CreateContatoUsecaseRequest,
  ): Promise<CreateContatoUsecaseResponse> {
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

    const contato = await this.contatoRepository.create({
      nome,
      telefone,
    });

    return contato;
  }
}
