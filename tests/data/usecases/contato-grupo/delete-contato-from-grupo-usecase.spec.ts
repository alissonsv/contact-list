import { ValidationError } from "#/data/errors/validation-error";
import { makeContatoGrupoRepositoryStub } from "#/tests/mocks/contato-grupo-repository-stub";
import { DeleteContatosFromGrupoUsecase } from "#/data/usecases/contato-grupo/delete-contatos-from-grupo-usecase";

function makeSut() {
  const contatoGrupoRepositoryStub = makeContatoGrupoRepositoryStub();
  const sut = new DeleteContatosFromGrupoUsecase(contatoGrupoRepositoryStub);

  return { sut, contatoGrupoRepositoryStub };
}

describe("DeleteContatosFromGrupo Usecase", () => {
  test("Should return undefined if delete contacts from group successfully", async () => {
    const { sut } = makeSut();

    await expect(
      sut.execute({ contatoIds: [1, 2, 3], grupoId: 1 }),
    ).resolves.toBeUndefined();
  });

  test("Should not call contatoGrupoRepository and return undefined if contatoIds is empty", async () => {
    const { sut, contatoGrupoRepositoryStub } = makeSut();

    const deleteContactsSpy = jest.spyOn(
      contatoGrupoRepositoryStub,
      "deleteContactsFromGroup",
    );

    await expect(
      sut.execute({ contatoIds: [], grupoId: 1 }),
    ).resolves.toBeUndefined();

    expect(deleteContactsSpy).not.toHaveBeenCalled();
  });

  test("Should allow contatoId to be a number", async () => {
    const { sut } = makeSut();

    await expect(
      sut.execute({ contatoIds: 12, grupoId: 1 }),
    ).resolves.toBeUndefined();
  });

  test("Should throw ValidationError if contatoIds is not valid", async () => {
    const { sut } = makeSut();

    await expect(
      sut.execute({
        contatoIds: ["asdf", "qwer", "zxcv"] as unknown as number[],
        grupoId: 1,
      }),
    ).rejects.toThrow(ValidationError);
  });

  test("Should throw ValidationError if grupoId is not valid", async () => {
    const { sut } = makeSut();

    await expect(
      sut.execute({
        contatoIds: [1, 2, 3],
        grupoId: "asdf" as unknown as number,
      }),
    ).rejects.toThrow(ValidationError);
  });

  test("Should throw error if any error occours while deleting contacts from group", async () => {
    const { sut, contatoGrupoRepositoryStub } = makeSut();

    jest
      .spyOn(contatoGrupoRepositoryStub, "deleteContactsFromGroup")
      .mockRejectedValueOnce(new Error("test error"));

    await expect(
      sut.execute({ contatoIds: [1, 2, 3], grupoId: 1 }),
    ).rejects.toThrow(new Error("test error"));
  });
});
