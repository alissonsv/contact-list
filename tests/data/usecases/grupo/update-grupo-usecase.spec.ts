import { ValidationError } from "#/data/errors/validation-error";
import { makeGrupoRepositoryStub } from "#/tests/mocks/grupo-repository-stub";
import { UpdateGrupoUsecase } from "#/data/usecases/grupo/update-grupo-usecase";

function makeSut() {
  const grupoRepositoryStub = makeGrupoRepositoryStub();
  const sut = new UpdateGrupoUsecase(grupoRepositoryStub);

  return { sut, grupoRepositoryStub };
}

describe("UpdateGrupo Usecase", () => {
  test("Should return grupo if it was updated successfully", async () => {
    const { sut } = makeSut();

    await expect(sut.execute(1, { nome: "Grupo1" })).resolves.toEqual({
      id: 1,
      nome: "Grupo1",
    });
  });

  test("Should throw ValidationError if data is invalid", async () => {
    const { sut } = makeSut();

    await expect(() =>
      sut.execute("asdf", { nome: "Grupo 1" }),
    ).rejects.toThrow(ValidationError);
  });

  test("Should throw error if any error occours while reading group", async () => {
    const { sut, grupoRepositoryStub } = makeSut();

    jest
      .spyOn(grupoRepositoryStub, "update")
      .mockRejectedValueOnce(new Error("test error"));

    await expect(() => sut.execute(1, { nome: "Grupo1" })).rejects.toThrow(
      new Error("test error"),
    );
  });
});
