import { UpdateContatoUsecase } from "#/data/usecases/contato/update-contato-usecase";
import { makeContatoRepositoryStub } from "#/tests/mocks/contato-repository-stub";
import { ValidationError } from "#/data/errors/validation-error";

function makeSut() {
  const contatoRepositoryStub = makeContatoRepositoryStub();
  const sut = new UpdateContatoUsecase(contatoRepositoryStub);

  return {
    sut,
    contatoRepositoryStub,
  };
}

describe("UpdateContato Usecase", () => {
  test("Should return 'contato' object if update successfully", async () => {
    const { sut } = makeSut();

    await expect(
      sut.execute(1, { nome: "John Doe", telefone: "1234567890" }),
    ).resolves.toEqual({
      id: 1,
      nome: "John Doe",
      telefone: "1234567890",
    });
  });

  test("Should throw ValidationError if 'id' is not a number", async () => {
    const { sut } = makeSut();

    await expect(
      sut.execute("asoidfj", { nome: "John Doe", telefone: "1234567890" }),
    ).rejects.toThrow(ValidationError);
  });

  test("Should throw ValidationError if 'nome' has less than 2 words", async () => {
    const { sut } = makeSut();

    await expect(
      sut.execute(1, { nome: "John", telefone: "1234567890" }),
    ).rejects.toThrow(ValidationError);
  });

  test("Should throw ValidationError if telefone does not contains 10 digits", async () => {
    const { sut } = makeSut();

    await expect(
      sut.execute(1, { nome: "any nome", telefone: "123" }),
    ).rejects.toThrow(ValidationError);

    await expect(
      sut.execute(1, { nome: "any nome", telefone: "123456789123456789" }),
    ).rejects.toThrow(ValidationError);
  });

  test("Should throw error if any error occours on contact update", async () => {
    const { sut, contatoRepositoryStub } = makeSut();

    jest
      .spyOn(contatoRepositoryStub, "update")
      .mockRejectedValueOnce(new Error("test error"));

    await expect(
      sut.execute(1, { nome: "any nome", telefone: "9999999999" }),
    ).rejects.toThrow(new Error("test error"));
  });
});
