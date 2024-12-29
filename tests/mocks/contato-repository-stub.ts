import { IContactRepository } from "#/domain/interfaces/contact-repository";
import { Contato } from "@prisma/client";

export function makeContatoRepositoryStub() {
  class ContactRepositoryStub implements IContactRepository {
    async getAll(_page: number): Promise<Contato[]> {
      return [];
    }

    async update(data: Contato): Promise<Contato> {
      return data;
    }

    async deleteById(_id: number): Promise<void> {
      return;
    }

    async create({ nome, telefone }: Contato): Promise<Contato> {
      return {
        id: 1,
        nome,
        telefone,
      };
    }
  }

  return new ContactRepositoryStub();
}
