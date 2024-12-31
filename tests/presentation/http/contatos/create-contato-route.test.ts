import { CreateContatoUsecase } from "#/data/usecases/create-contato-usecase";
import { prisma } from "#/lib/prisma";
import { app } from "#/main/app";
import { faker } from "@faker-js/faker/.";
import request from "supertest";

describe("Create contato route (e2e)", () => {
  test("Should return 201 with the contact data if create a contact successfully", async () => {
    const fakeContactData = {
      nome: faker.person.fullName(),
      telefone: faker.string.numeric(10),
    };

    const response = await request(app)
      .post("/contatos")
      .send(fakeContactData)
      .expect(201);

    expect(response.body).toEqual({
      ...fakeContactData,
      id: expect.any(Number),
    });
  });

  test("Should return 400 if any data is invalid", async () => {
    await request(app)
      .post("/contatos")
      .send({
        nome: "John",
        telefone: "x",
      })
      .expect(400);
  });

  test("Should return 409 if contact's telefone already exists", async () => {
    const contactData = {
      nome: "John Doe",
      telefone: "9999999999",
    };
    await prisma.contato.create({
      data: contactData,
    });

    await request(app).post("/contatos").send(contactData).expect(409);
  });

  test("Should return 500 if any unexpected error occours", async () => {
    jest
      .spyOn(CreateContatoUsecase.prototype, "execute")
      .mockRejectedValueOnce(new Error());

    await request(app)
      .post("/contatos")
      .send({
        nome: "John Doe",
        telefone: "9999999999",
      })
      .expect(500);
  });
});
