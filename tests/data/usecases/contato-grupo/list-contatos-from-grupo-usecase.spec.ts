import { ValidationError } from "#/data/errors/validation-error";
import { makeContatoGrupoRepositoryStub } from "#/tests/mocks/contato-grupo-repository-stub";
import { ListContatosFromGrupoUsecase } from "#/data/usecases/contato-grupo/list-contatos-from-grupo-usecase";

function makeSut() {
  const contatoGrupoRepositoryStub = makeContatoGrupoRepositoryStub();
  const sut = new ListContatosFromGrupoUsecase(contatoGrupoRepositoryStub);

  return { sut, contatoGrupoRepositoryStub };
}

describe("ListContatosFromGrupo Usecase", () => {
  test("Should return an array of contacts from group", async () => {
    const { sut } = makeSut();

    await expect(sut.execute(1, 1)).resolves.toEqual(expect.any(Array));
  });

  test("Should throw ValidationError if grupoId is not valid", async () => {
    const { sut } = makeSut();

    await expect(sut.execute("asdf" as unknown as number, 1)).rejects.toThrow(
      ValidationError,
    );
  });

  test("Should throw error if any error occours while listing contacts from group", async () => {
    const { sut, contatoGrupoRepositoryStub } = makeSut();

    jest
      .spyOn(contatoGrupoRepositoryStub, "listGroupContacts")
      .mockRejectedValueOnce(new Error("test error"));

    await expect(sut.execute(1, 1)).rejects.toThrow(new Error("test error"));
  });
});
