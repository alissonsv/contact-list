import request from "supertest";
import { prisma } from "#/lib/prisma";
import { app } from "#/main/app";
import { ListContatosFromGrupoUsecase } from "#/data/usecases/contato-grupo/list-contatos-from-grupo-usecase";

describe("List Contacts From Group Route (e2e)", () => {
  test("Should receive an array of contacts from group and return 200", async () => {
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

    const response = await request(app).get(`/grupos/${group.id}/contatos`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        id: contact2.id,
        nome: "Jane Doe",
        telefone: "2222222222",
      },
      {
        id: contact1.id,
        nome: "John Doe",
        telefone: "1111111111",
      },
    ]);
  });

  test("Should return only 20 contacts per page", async () => {
    const group = await prisma.grupo.create({
      data: {
        nome: "Grupo 1",
      },
    });

    for (let i = 0; i < 30; i++) {
      const contato = await prisma.contato.create({
        data: {
          nome: `Contato ${i}`,
          telefone: `111111111${i.toString().padStart(2, "0")}`,
        },
      });

      await prisma.contatoGrupo.create({
        data: {
          contato_id: contato.id,
          grupo_id: group.id,
        },
      });
    }

    const response = await request(app).get(`/grupos/${group.id}/contatos`);

    expect(response.body).toHaveLength(20);
  });

  test("Should return an empty array if group has no contacts", async () => {
    const grupo = await prisma.grupo.create({
      data: {
        nome: "Grupo 1",
      },
    });

    const response = await request(app).get(`/grupos/${grupo.id}/contatos`);
    expect(response.body).toEqual([]);
  });

  test("Should return 404 if group does not exist", async () => {
    await request(app).get("/grupos/99/contatos").expect(404);
  });

  test("Should return 500 if any error occurs", async () => {
    jest
      .spyOn(ListContatosFromGrupoUsecase.prototype, "execute")
      .mockRejectedValueOnce(new Error());

    await request(app).get(`/grupos/1/contatos`).expect(500);
  });
});
