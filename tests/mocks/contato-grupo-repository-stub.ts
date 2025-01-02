import { Contato } from "@prisma/client";

import {
  GroupContactsReportResponse,
  IContactGroupRepository,
} from "#/domain/interfaces/contact-group-repository";

export function makeContatoGrupoRepositoryStub() {
  class ContatoGrupoRepositoryStub implements IContactGroupRepository {
    async insertContactsIntoGroup(
      _contactId: number[],
      _groupId: number,
    ): Promise<void> {
      return;
    }

    async deleteContactsFromGroup(
      _contactId: number[],
      _groupId: number,
    ): Promise<void> {
      return;
    }

    async listGroupContacts(
      _groupId: number,
      _page: number,
    ): Promise<Contato[]> {
      return [
        {
          id: 1,
          nome: "John Doe",
          telefone: "1111111111",
        },
        {
          id: 2,
          nome: "Jane Doe",
          telefone: "2222222222",
        },
      ];
    }

    async getGroupContactsReport(): Promise<GroupContactsReportResponse[]> {
      return [
        { grupo: "Cliente X", quantidade_contatos: 35 },
        { grupo: "Fornecedores", quantidade_contatos: 20 },
      ];
    }
  }

  return new ContatoGrupoRepositoryStub();
}
