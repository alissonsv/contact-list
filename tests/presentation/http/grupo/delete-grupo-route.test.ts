import request from "supertest";
import { prisma } from "#/lib/prisma";
import { app } from "#/main/app";
import { DeleteGrupoUsecase } from "#/data/usecases/grupo/delete-grupo-usecase";

describe("Delete Grupo Route (e2e)", () => {
  test("Should delete a group and return 204", async () => {
    const groupToBeDeleted = await prisma.grupo.create({
      data: {
        nome: "Grupo 1",
      },
    });

    await request(app).delete(`/grupos/${groupToBeDeleted.id}`).expect(204);
  });

  test("Should return 404 if group to be deleted does not exists", async () => {
    await request(app).delete("/grupos/99").expect(404);
  });

  test("Should return 500 if any error occours while deleting group", async () => {
    jest
      .spyOn(DeleteGrupoUsecase.prototype, "execute")
      .mockRejectedValueOnce(new Error());

    await request(app).delete("/grupos/99").expect(500);
  });
});
