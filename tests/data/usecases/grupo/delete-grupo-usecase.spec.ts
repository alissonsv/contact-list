import { makeGrupoRepositoryStub } from "#/tests/mocks/grupo-repository-stub";
import { DeleteGrupoUsecase } from "#/data/usecases/grupo/delete-grupo-usecase";
import { ValidationError } from "#/data/errors/validation-error";

function makeSut() {
  const grupoRepositoryStub = makeGrupoRepositoryStub();
  const sut = new DeleteGrupoUsecase(grupoRepositoryStub);

  return {
    sut,
    grupoRepositoryStub,
  };
}

describe("DeleteGrupo Usecase", () => {
  test("Should return nothing if delete successfully", async () => {
    const { sut } = makeSut();

    await expect(sut.execute(1)).resolves.toBeUndefined();
  });

  test("Should throw ValidationError if id is not a number", async () => {
    const { sut } = makeSut();

    await expect(sut.execute("dfasdf")).rejects.toThrow(ValidationError);
  });

  test("Should throw error if any error occours on grupo delete", async () => {
    const { sut, grupoRepositoryStub } = makeSut();

    jest
      .spyOn(grupoRepositoryStub, "deleteById")
      .mockRejectedValueOnce(new Error("test error"));

    await expect(sut.execute(1)).rejects.toThrow(new Error("test error"));
  });
});
