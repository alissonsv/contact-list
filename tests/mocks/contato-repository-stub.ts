import { faker } from "@faker-js/faker";
import { Contato } from "@prisma/client";

import { IContactRepository } from "#/domain/interfaces/contact-repository";

export function makeContatoRepositoryStub() {
  class ContactRepositoryStub implements IContactRepository {
    async getAll(_page: number): Promise<Contato[]> {
      const name1 = faker.person.fullName();
      const name2 = faker.person.fullName();

      const sortedNames = [name1, name2].sort();

      return [
        {
          id: 1,
          nome: sortedNames[0],
          telefone: faker.string.numeric(10),
        },
        {
          id: 2,
          nome: sortedNames[1],
          telefone: faker.string.numeric(10),
        },
      ];
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
