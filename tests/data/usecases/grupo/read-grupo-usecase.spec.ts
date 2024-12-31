import { prisma } from "#/lib/prisma";
import { ReadGrupoUsecase } from "#/data/usecases/grupo/read-grupo-usecase";
import { makeGrupoRepositoryStub } from "#/tests/mocks/grupo-repository-stub";
import { ValidationError } from "#/data/errors/validation-error";
import { ResourceNotFoundError } from "#/data/errors/resource-not-found-error";

function makeSut() {
  const grupoRepositoryStub = makeGrupoRepositoryStub();
  const sut = new ReadGrupoUsecase(grupoRepositoryStub);

  return { sut, grupoRepositoryStub };
}

describe("Read Grupo Usecase", () => {
  test("Should return grupo if it exists", async () => {
    const { sut } = makeSut();

    await expect(sut.execute(1)).resolves.toEqual({
      id: 1,
      nome: "Grupo 1",
    });
  });

  test("Should throw ValidationError if group id is invalid", async () => {
    const { sut } = makeSut();

    await expect(() =>
      sut.execute("asdf" as unknown as number),
    ).rejects.toThrow(ValidationError);
  });

  test("Should throw ResourceNotFoundError if grupo returns null by the repository", async () => {
    const { sut, grupoRepositoryStub } = makeSut();
    jest.spyOn(grupoRepositoryStub, "read").mockResolvedValueOnce(null);

    await expect(sut.execute(1)).rejects.toThrow(ResourceNotFoundError);
  });

  test("Should throw error if any unexpected error occours", async () => {
    const { sut, grupoRepositoryStub } = makeSut();

    jest
      .spyOn(grupoRepositoryStub, "read")
      .mockRejectedValueOnce(new Error("test error"));

    await expect(() => sut.execute(1)).rejects.toThrow(new Error("test error"));
  });
});
