import request from "supertest";

import { app } from "#/main/app";
import { prisma } from "#/lib/prisma";
import { CreateGrupoUsecase } from "#/data/usecases/grupo/create-grupo-usecase";

describe("Create Grupo Route (e2e)", () => {
  test("Should return 201 with the group data if created successfully", async () => {
    const response = await request(app).post("/grupos").send({
      nome: "Grupo 1",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(Number),
      nome: "Grupo 1",
    });
  });

  test("Should return 400 if data is invalid", async () => {
    await request(app)
      .post("/grupos")
      .send({
        nome: null,
      })
      .expect(400);
  });

  test("Should return 409 if group name already exists", async () => {
    await prisma.grupo.create({
      data: {
        nome: "Grupo 1",
      },
    });

    await request(app)
      .post("/grupos")
      .send({
        nome: "Grupo 1",
      })
      .expect(409);
  });

  test("Should return 500 if any unexpected error occours", async () => {
    jest
      .spyOn(CreateGrupoUsecase.prototype, "execute")
      .mockRejectedValueOnce(new Error("test error"));

    await request(app)
      .post("/grupos")
      .send({
        nome: "Grupo 1",
      })
      .expect(500);
  });
});
