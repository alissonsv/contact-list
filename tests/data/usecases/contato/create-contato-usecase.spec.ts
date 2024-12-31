import { CreateContatoUsecase } from "#/data/usecases/contato/create-contato-usecase";
import { ValidationError } from "#/data/errors/validation-error";
import { makeContatoRepositoryStub } from "#/tests/mocks/contato-repository-stub";

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

  test("Should throw ValidationError if telefone does not contains 10 digits", async () => {
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
