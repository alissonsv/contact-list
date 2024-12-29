import { Contato } from "@prisma/client";

import { CreateContatoUsecase } from "#/data/usecases/create-contato-usecase";
import { IContactRepository } from "#/domain/interfaces/contact-repository";
import { ValidationError } from "#/data/errors/validation-error";

function makeContatoRepositoryStub() {
  class ContactRepositoryStub implements IContactRepository {
    async getAll(_page: number): Promise<Contato[]> {
      return [];
    }

    async update(data: Contato): Promise<Contato> {
      return data;
    }

    async deleteById(_id: number): Promise<void> {
      return;
    }

    async create({ nome, telefone }: Contato): Promise<Contato> {
      return {
        id: 1,
        nome,
        telefone,
      };
    }
  }

  return new ContactRepositoryStub();
}

function makeSut() {
  const contatoRepositoryStub = makeContatoRepositoryStub();
  const sut = new CreateContatoUsecase(contatoRepositoryStub);

  return { sut, contatoRepositoryStub };
}

describe("CreateContato Usecase", () => {
  test("Should return contato if it was created successfully", async () => {
    const { sut } = makeSut();

    await expect(
      sut.execute({ nome: "any nome", telefone: "9999999999" }),
    ).resolves.toEqual({
      id: 1,
      nome: "any nome",
      telefone: "9999999999",
    });
  });

  test("Should throw ValidationError if nome contains less than 2 words", async () => {
    const { sut } = makeSut();

    await expect(
      sut.execute({ nome: "any", telefone: "9999999999" }),
    ).rejects.toThrow(ValidationError);
  });

  test("Should throw ValidationError if telefone does not contains 9 digits", async () => {
    const { sut } = makeSut();

    await expect(
      sut.execute({ nome: "any nome", telefone: "123" }),
    ).rejects.toThrow(ValidationError);

    await expect(
      sut.execute({ nome: "any nome", telefone: "123456789123456789" }),
    ).rejects.toThrow(ValidationError);
  });

  test("Should throw error if any error occours on contact creation", async () => {
    const { sut, contatoRepositoryStub } = makeSut();

    jest
      .spyOn(contatoRepositoryStub, "create")
      .mockRejectedValueOnce(new Error("test error"));

    await expect(
      sut.execute({ nome: "any nome", telefone: "9999999999" }),
    ).rejects.toThrow(new Error("test error"));
  });
});
