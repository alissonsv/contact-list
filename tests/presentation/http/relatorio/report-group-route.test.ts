import request from "supertest";
import { prisma } from "#/lib/prisma";
import { app } from "#/main/app";
import { ReportGroupUsecase } from "#/data/usecases/contato-grupo/report-group-usecase";

describe("Report Group Route (e2e)", () => {
  test("Should receive an array with group report sorted by contact length and return 200", async () => {
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

    const contact3 = await prisma.contato.create({
      data: {
        nome: "Bob Doe",
        telefone: "3333333333",
      },
    });

    const group = await prisma.grupo.create({
      data: {
        nome: "Grupo 1",
      },
    });

    const group2 = await prisma.grupo.create({
      data: {
        nome: "Grupo 2",
      },
    });

    await prisma.contatoGrupo.createMany({
      data: [
        { contato_id: contact1.id, grupo_id: group.id },
        { contato_id: contact2.id, grupo_id: group2.id },
        { contato_id: contact3.id, grupo_id: group2.id },
      ],
    });

    const response = await request(app).get("/relatorio/contatos-grupos");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        grupo: "Grupo 2",
        quantidade_contatos: 2,
      },
      {
        grupo: "Grupo 1",
        quantidade_contatos: 1,
      },
    ]);
  });

  test("Should return an empty array if no group is found", async () => {
    const response = await request(app).get("/relatorio/contatos-grupos");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("Should return 500 if any error occours while generating the report", async () => {
    jest
      .spyOn(ReportGroupUsecase.prototype, "execute")
      .mockRejectedValueOnce(new Error());

    await request(app).get("/relatorio/contatos-grupos").expect(500);
  });
});
