import request from "supertest";
import { prisma } from "#/lib/prisma";
import { app } from "#/main/app";
import { DeleteContatosFromGrupoUsecase } from "#/data/usecases/contato-grupo/delete-contatos-from-grupo-usecase";

describe("Delete Contacts From Group Route (e2e)", () => {
  test("Should delete an array of contacts from group and return 204", async () => {
    const contact1 = await prisma.contato.create({
      data: {
        nome: "John Doe",
        telefone: "1111111111",
      },
    });

    const contact2 = await prisma.contato.create({
      data: {
        nome: "Jane Doe",
        telefone: "2222222222",
      },
    });

    const group = await prisma.grupo.create({
      data: {
        nome: "Grupo 1",
      },
    });

    await prisma.contatoGrupo.createMany({
      data: [
        { contato_id: contact1.id, grupo_id: group.id },
        { contato_id: contact2.id, grupo_id: group.id },
      ],
    });

    await request(app)
      .delete(`/grupos/${group.id}/contatos`)
      .send({
        contatoIds: [contact1.id, contact2.id],
      })
      .expect(204);

    const contactsIntoGroup = await prisma.contatoGrupo.findMany({
      where: {
        grupo_id: group.id,
      },
    });

    expect(contactsIntoGroup).toHaveLength(0);
  });

  test("Should allow contatoId to be a number and return 204", async () => {
    const contact = await prisma.contato.create({
      data: {
        nome: "John Doe",
        telefone: "1111111111",
      },
    });

    const group = await prisma.grupo.create({
      data: {
        nome: "Grupo 1",
      },
    });

    await prisma.contatoGrupo.create({
      data: {
        contato_id: contact.id,
        grupo_id: group.id,
      },
    });

    await request(app)
      .delete(`/grupos/${group.id}/contatos`)
      .send({
        contatoIds: contact.id,
      })
      .expect(204);

    const contactsIntoGroup = await prisma.contatoGrupo.findMany({
      where: {
        grupo_id: group.id,
      },
    });

    expect(contactsIntoGroup).toHaveLength(0);
  });

  test("Should return 204 if contatoIds is empty", async () => {
    await request(app)
      .delete("/grupos/99/contatos")
      .send({
        contatoIds: [],
      })
      .expect(204);
  });

  test("Should return 400 if contatoIds is not valid", async () => {
    await request(app)
      .delete(`/grupos/12/contatos`)
      .send({
        contatoIds: ["asdf", "qwer", "zxcv"],
      })
      .expect(400);
  });

  test("Should return 400 if grupoId is not valid", async () => {
    await request(app)
      .delete(`/grupos/asdf/contatos`)
      .send({
        contatoIds: [1, 2, 3],
      })
      .expect(400);
  });

  test("Should return 404 if group does not exist", async () => {
    await request(app)
      .delete("/grupos/99/contatos")
      .send({
        contatoIds: [1, 2, 3],
      })
      .expect(404);
  });

  test("Should return 500 if any error occurs", async () => {
    jest
      .spyOn(DeleteContatosFromGrupoUsecase.prototype, "execute")
      .mockRejectedValueOnce(new Error());

    await request(app)
      .delete(`/grupos/1/contatos`)
      .send({
        contatoIds: [1, 2, 3],
      })
      .expect(500);
  });
});
