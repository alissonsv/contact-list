import { Prisma, Grupo } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { prisma } from "#/lib/prisma";
import { IGroupRepository } from "#/domain/interfaces/group-repository";
import { ResourceNotFoundError } from "#/data/errors/resource-not-found-error";
import { ResourceAlreadyExistsError } from "#/data/errors/resource-already-exists-error";

export class PrismaGroupRepository implements IGroupRepository {
  async create(data: Prisma.GrupoCreateInput): Promise<Grupo> {
    try {
      const grupo = await prisma.grupo.create({
        data,
      });

      return grupo;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        // throws when unique constraint already exists
        // https://www.prisma.io/docs/orm/reference/error-reference#p2002
        if (err.code === "P2002") {
          throw new ResourceAlreadyExistsError();
        }
      }

      throw err;
    }
  }

  async read(id: number): Promise<Grupo | null> {
    return prisma.grupo.findFirst({
      where: {
        id,
      },
    });
  }

  async update(data: Grupo): Promise<Grupo> {
    try {
      return prisma.grupo.update({
        where: {
          id: data.id,
        },
        data,
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        // throw when id is not found
        // https://www.prisma.io/docs/orm/reference/error-reference#p2025
        if (err.code === "P2025") {
          throw new ResourceNotFoundError();
        }
        // throws when unique constraint already exists
        // https://www.prisma.io/docs/orm/reference/error-reference#p2002
        if (err.code === "P2002") {
          throw new ResourceAlreadyExistsError();
        }
      }

      throw err;
    }
  }

  async deleteById(id: number): Promise<void> {
    try {
      await prisma.grupo.delete({
        where: {
          id,
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        // throw when id is not found
        // https://www.prisma.io/docs/orm/reference/error-reference#p2025
        if (err.code === "P2025") {
          throw new ResourceNotFoundError();
        }
      }

      throw err;
    }
  }
}
