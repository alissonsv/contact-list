import { ValidationError } from "#/data/errors/validation-error";
import { DeleteContatoUsecase } from "#/data/usecases/contato/delete-contato-usecase";
import { makeContatoRepositoryStub } from "#/tests/mocks/contato-repository-stub";

function makeSut() {
  const contatoRepositoryStub = makeContatoRepositoryStub();
  const sut = new DeleteContatoUsecase(contatoRepositoryStub);

  return {
    sut,
    contatoRepositoryStub,
  };
}

describe("DeleteContato Usecase", () => {
  test("Should return nothing if delete successfully", async () => {
    const { sut } = makeSut();

    await expect(sut.execute(1)).resolves.toBeUndefined();
  });

  test("Should throw ValidationError if id is not a number", async () => {
    const { sut } = makeSut();

    await expect(sut.execute("dfasdf")).rejects.toThrow(ValidationError);
  });

  test("Should throw error if any error occours on contact delete", async () => {
    const { sut, contatoRepositoryStub } = makeSut();

    jest
      .spyOn(contatoRepositoryStub, "deleteById")
      .mockRejectedValueOnce(new Error("test error"));

    await expect(sut.execute(1)).rejects.toThrow(new Error("test error"));
  });
});
