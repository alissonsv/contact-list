import request from "supertest";

import { app } from "#/main/app";
import { prisma } from "#/lib/prisma";
import { ReadGrupoUsecase } from "#/data/usecases/grupo/read-grupo-usecase";

describe("Read Grupo Route (e2e)", () => {
  test("Should return 200 with the group data if it exists", async () => {
    const grupoToBeRead = await prisma.grupo.create({
      data: {
        nome: "Grupo 1",
      },
    });

    const response = await request(app).get(`/grupos/${grupoToBeRead.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(Number),
      nome: "Grupo 1",
    });
  });

  test("Should return 400 if grupoId is invalid", async () => {
    await request(app).get("/grupos/asdf").expect(400);
  });

  test("Should return 404 if group does not exists", async () => {
    await request(app).get("/grupos/99").expect(404);
  });

  test("Should return 500 if any unexpected error occours", async () => {
    jest
      .spyOn(ReadGrupoUsecase.prototype, "execute")
      .mockRejectedValueOnce(new Error("test error"));

    await request(app).get("/grupos/99").expect(500);
  });
});
