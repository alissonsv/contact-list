import request from "supertest";
import { prisma } from "#/lib/prisma";
import { app } from "#/main/app";
import { InsertContatosIntoGrupoUsecase } from "#/data/usecases/contato-grupo/insert-contatos-into-grupo-usecase";

describe("Insert Contacts Into Group Route (e2e)", () => {
  test("Should insert an array of contacts into group and return 204", async () => {
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

    await request(app)
      .post(`/grupos/${group.id}/contatos`)
      .send({
        contatoIds: [contact1.id, contact2.id],
      })
      .expect(204);

    const contactsIntoGroup = await prisma.contatoGrupo.findMany({
      where: {
        grupo_id: group.id,
      },
    });

    expect(contactsIntoGroup).toHaveLength(2);
    expect(contactsIntoGroup).toEqual([
      { contato_id: contact1.id, grupo_id: group.id },
      { contato_id: contact2.id, grupo_id: group.id },
    ]);
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

    await request(app)
      .post(`/grupos/${group.id}/contatos`)
      .send({
        contatoIds: contact.id,
      })
      .expect(204);

    const contactsIntoGroup = await prisma.contatoGrupo.findMany({
      where: {
        grupo_id: group.id,
      },
    });

    expect(contactsIntoGroup).toHaveLength(1);
    expect(contactsIntoGroup).toEqual([
      { contato_id: contact.id, grupo_id: group.id },
    ]);
  });

  test("Should return 204 if contatoIds is empty", async () => {
    const group = await prisma.grupo.create({
      data: {
        nome: "Grupo 1",
      },
    });

    await request(app)
      .post(`/grupos/${group.id}/contatos`)
      .send({
        contatoIds: [],
      })
      .expect(204);
  });

  test("Should return 400 if contatoIds is not valid", async () => {
    await request(app)
      .post(`/grupos/12/contatos`)
      .send({
        contatoIds: ["asdf", "qwer", "zxcv"],
      })
      .expect(400);
  });

  test("Should return 400 if grupoId is not valid", async () => {
    await request(app)
      .post(`/grupos/asdf/contatos`)
      .send({
        contatoIds: [1, 2, 3],
      })
      .expect(400);
  });

  test("Should return 404 if group does not exist", async () => {
    await request(app)
      .post(`/grupos/99/contatos`)
      .send({
        contatoIds: [1, 2, 3],
      })
      .expect(404);
  });

  test("Should return 500 if any error occurs", async () => {
    jest
      .spyOn(InsertContatosIntoGrupoUsecase.prototype, "execute")
      .mockRejectedValueOnce(new Error());

    await request(app)
      .post(`/grupos/1/contatos`)
      .send({
        contatoIds: [1, 2, 3],
      })
      .expect(500);
  });
});
