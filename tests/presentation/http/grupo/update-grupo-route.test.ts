import request from "supertest";

import { app } from "#/main/app";
import { prisma } from "#/lib/prisma";
import { UpdateGrupoUsecase } from "#/data/usecases/grupo/update-grupo-usecase";

describe("Update Grupo Route (e2e)", () => {
  test("Should return 200 with the group data if update successfully", async () => {
    const grupoToBeUpdated = await prisma.grupo.create({
      data: {
        nome: "Grupo 1",
      },
    });

    const response = await request(app)
      .patch(`/grupos/${grupoToBeUpdated.id}`)
      .send({
        nome: "Grupo 2",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(Number),
      nome: "Grupo 2",
    });
  });

  test("Should return 400 if data is invalid", async () => {
    await request(app)
      .patch("/grupos/asdf")
      .send({
        nome: "Grupo 1",
      })
      .expect(400);
  });

  test("Should return 409 if group name already exists", async () => {
    const grupoToBeUpdated = await prisma.grupo.create({
      data: {
        nome: "Grupo 1",
      },
    });

    await prisma.grupo.create({
      data: {
        nome: "Grupo 2",
      },
    });

    await request(app)
      .patch(`/grupos/${grupoToBeUpdated.id}`)
      .send({
        nome: "Grupo 2",
      })
      .expect(409);
  });

  test("Should return 500 if any unexpected error occours", async () => {
    jest
      .spyOn(UpdateGrupoUsecase.prototype, "execute")
      .mockRejectedValueOnce(new Error("test error"));

    await request(app)
      .patch("/grupos/123")
      .send({
        nome: "Grupo 1",
      })
      .expect(500);
  });
});
