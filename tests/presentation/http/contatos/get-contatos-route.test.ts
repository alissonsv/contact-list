import request from "supertest";

import { app } from "#/main/app";
import { prisma } from "#/lib/prisma";
import { GetContatosUsecase } from "#/data/usecases/contato/get-contatos-usecase";

describe("Get Contatos route (e2e)", () => {
  test("Should return 200 with a list of contacts sorted by name", async () => {
    await prisma.contato.createMany({
      data: [
        {
          nome: "John Doe",
          telefone: "1111111111",
        },
        {
          nome: "Jane Doe",
          telefone: "2222222222",
        },
      ],
    });

    const response = await request(app).get("/contatos");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        id: expect.any(Number),
        nome: "Jane Doe",
        telefone: "2222222222",
      },
      {
        id: expect.any(Number),
        nome: "John Doe",
        telefone: "1111111111",
      },
    ]);
  });

  test("Should return 200 with an empty list if no contacts was created", async () => {
    const response = await request(app).get("/contatos");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("Should return 500 if any unexpected error occours", async () => {
    jest
      .spyOn(GetContatosUsecase.prototype, "execute")
      .mockRejectedValueOnce(new Error());

    await request(app).get("/contatos").expect(500);
  });
});
