import request from "supertest";
import { prisma } from "#/lib/prisma";
import { app } from "#/main/app";
import { DeleteContatoUsecase } from "#/data/usecases/delete-contato-usecase";

describe("Delete Contato Route (e2e)", () => {
  test("Should delete a contact and return 204", async () => {
    const contactToBeDeleted = await prisma.contato.create({
      data: {
        nome: "John Doe",
        telefone: "1111111111",
      },
    });

    await request(app).delete(`/contatos/${contactToBeDeleted.id}`).expect(204);
  });

  test("Should return 404 if contact to be deleted does not exists", async () => {
    await request(app).delete("/contatos/99").expect(404);
  });

  test("Should return 500 if any error occours while deleting contact", async () => {
    jest
      .spyOn(DeleteContatoUsecase.prototype, "execute")
      .mockRejectedValueOnce(new Error());

    await request(app).delete("/contatos/99").expect(500);
  });
});
