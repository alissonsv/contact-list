import request from "supertest";

import { prisma } from "#/lib/prisma";
import { app } from "#/main/app";
import { UpdateContatoUsecase } from "#/data/usecases/contato/update-contato-usecase";

describe("Update Contato Route", () => {
  test("Should update a contact and return it with status 200", async () => {
    const contactToBeUpdated = await prisma.contato.create({
      data: {
        nome: "John Doe",
        telefone: "1111111111",
      },
    });

    const response = await request(app)
      .patch(`/contatos/${contactToBeUpdated.id}`)
      .send({
        nome: "John Doe",
        telefone: "2222222222",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(Number),
      nome: "John Doe",
      telefone: "2222222222",
    });
  });

  test("Should return 400 if body data provided is invalid", async () => {
    await request(app)
      .patch("/contatos/99")
      .send({
        nome: "John",
        telefone: "xpto",
      })
      .expect(400);
  });

  test("Should return 404 if contact to be updated does not exists", async () => {
    await request(app)
      .patch("/contatos/99")
      .send({
        nome: "John Doe",
        telefone: "1111111111",
      })
      .expect(404);
  });

  test("Should return 409 if contact's telefone to be updated already exists", async () => {
    const contactToBeUpdated = await prisma.contato.create({
      data: {
        nome: "John Doe",
        telefone: "1111111111",
      },
    });

    await prisma.contato.create({
      data: {
        nome: "Jane Doe",
        telefone: "2222222222",
      },
    });

    await request(app)
      .patch(`/contatos/${contactToBeUpdated.id}`)
      .send({
        nome: "John Doe",
        telefone: "2222222222",
      })
      .expect(409);
  });

  test("Should return 500 if any unexpected error occours", async () => {
    jest
      .spyOn(UpdateContatoUsecase.prototype, "execute")
      .mockRejectedValueOnce(new Error());

    await request(app).patch("/contatos/99").expect(500);
  });
});
