import { Prisma, Grupo } from "@prisma/client";
import { IGroupRepository } from "#/domain/interfaces/group-repository";

export function makeGrupoRepositoryStub() {
  class GroupRepositoryStub implements IGroupRepository {
    async create(data: Prisma.GrupoCreateInput): Promise<Grupo> {
      return {
        id: 1,
        nome: data.nome,
      };
    }

    async read(id: number): Promise<Grupo | null> {
      return {
        id,
        nome: "Grupo 1",
      };
    }

    async update(data: Grupo): Promise<Grupo> {
      return data;
    }

    async deleteById(_id: number): Promise<void> {
      return;
    }
  }

  return new GroupRepositoryStub();
}
