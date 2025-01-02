import { Contato } from "@prisma/client";

import {
  GroupContactsReportResponse,
  IContactGroupRepository,
} from "#/domain/interfaces/contact-group-repository";
import { prisma } from "#/lib/prisma";
import { ResourceNotFoundError } from "#/data/errors/resource-not-found-error";

export class PrismaContactGroupRepository implements IContactGroupRepository {
  async insertContactsIntoGroup(
    contactIds: number[],
    groupId: number,
  ): Promise<void> {
    const existGroup = await prisma.grupo.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!existGroup) {
      throw new ResourceNotFoundError();
    }

    const existingContacts = await prisma.contato.findMany({
      where: {
        id: {
          in: contactIds,
        },
      },
      select: { id: true },
    });

    await prisma.contatoGrupo.createMany({
      data: existingContacts.map((contact) => ({
        grupo_id: groupId,
        contato_id: contact.id,
      })),
      skipDuplicates: true,
    });
  }

  async deleteContactsFromGroup(
    contactIds: number[],
    groupId: number,
  ): Promise<void> {
    const existGroup = await prisma.grupo.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!existGroup) {
      throw new ResourceNotFoundError();
    }

    await prisma.contatoGrupo.deleteMany({
      where: {
        contato_id: {
          in: contactIds,
        },
        grupo_id: groupId,
      },
    });
  }

  async listGroupContacts(groupId: number, page: number): Promise<Contato[]> {
    const existGroup = await prisma.grupo.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!existGroup) {
      throw new ResourceNotFoundError();
    }

    const contacts = await prisma.contato.findMany({
      where: {
        contato_grupo: {
          some: {
            grupo_id: groupId,
          },
        },
      },
      take: 20,
      skip: (page - 1) * 20,
      orderBy: {
        nome: "asc",
      },
    });

    return contacts;
  }

  async getGroupContactsReport(): Promise<GroupContactsReportResponse[]> {
    const relatorio = await prisma.grupo.findMany({
      select: {
        nome: true,
        _count: {
          select: { contato_grupo: true },
        },
      },
      orderBy: {
        contato_grupo: { _count: "desc" },
      },
    });

    return relatorio.map((grupo) => ({
      grupo: grupo.nome,
      quantidade_contatos: grupo._count.contato_grupo,
    }));
  }
}
