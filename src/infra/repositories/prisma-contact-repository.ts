import { prisma } from "#/lib/prisma";
import { IContactRepository } from "#/domain/interfaces/contact-repository";
import { Contato, Prisma } from "@prisma/client";
import { ResourceNotFoundError } from "#/data/errors/resource-not-found-error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ResourceAlreadyExistsError } from "#/data/errors/resource-already-exists-error";

export class PrismaContactRepository implements IContactRepository {
  async create({ nome, telefone }: Prisma.ContatoCreateInput) {
    try {
      const contato = await prisma.contato.create({
        data: {
          nome,
          telefone,
        },
      });

      return contato;
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

  async getAll(page: number): Promise<Contato[]> {
    const contacts = await prisma.contato.findMany({
      take: 20,
      skip: (page - 1) * 20,
      orderBy: {
        nome: "asc",
      },
    });

    return contacts;
  }

  async update(data: Contato): Promise<Contato> {
    try {
      const updatedContact = await prisma.contato.update({
        where: {
          id: data.id,
        },
        data: data,
      });

      return updatedContact;
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

  async deleteById(id: number): Promise<void> {
    try {
      await prisma.contato.delete({
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
