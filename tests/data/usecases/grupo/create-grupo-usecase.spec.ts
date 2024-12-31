import { ValidationError } from "#/data/errors/validation-error";
import { CreateGrupoUsecase } from "#/data/usecases/grupo/create-grupo-usecase";
import { makeGrupoRepositoryStub } from "#/tests/mocks/grupo-repository-stub";

function makeSut() {
  const grupoRepositoryStub = makeGrupoRepositoryStub();
  const sut = new CreateGrupoUsecase(grupoRepositoryStub);

  return { sut, grupoRepositoryStub };
}

describe("CreateGrupo Usecase", () => {
  test("Should return grupo if it was created successfully", async () => {
    const { sut } = makeSut();

    await expect(sut.execute({ nome: "Grupo1" })).resolves.toEqual({
      id: 1,
      nome: "Grupo1",
    });
  });

  test("Should throw ValidationError if nome was not given", async () => {
    const { sut } = makeSut();

    await expect(() => sut.execute({ nome: "" })).rejects.toThrow(
      ValidationError,
    );
  });

  test("Should throw ValidationError if nome is null or undefined", async () => {
    const { sut } = makeSut();

    await expect(() =>
      sut.execute({ nome: null as unknown as string }),
    ).rejects.toThrow(ValidationError);

    await expect(() =>
      sut.execute({ nome: undefined as unknown as string }),
    ).rejects.toThrow(ValidationError);
  });

  test("Should throw error if any error occours while creating group", async () => {
    const { sut, grupoRepositoryStub } = makeSut();

    jest
      .spyOn(grupoRepositoryStub, "create")
      .mockRejectedValueOnce(new Error("test error"));

    await expect(() => sut.execute({ nome: "Grupo1" })).rejects.toThrow(
      new Error("test error"),
    );
  });
});
