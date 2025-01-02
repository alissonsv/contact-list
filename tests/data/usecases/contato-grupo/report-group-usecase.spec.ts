import { makeContatoGrupoRepositoryStub } from "#/tests/mocks/contato-grupo-repository-stub";
import { ReportGroupUsecase } from "#/data/usecases/contato-grupo/report-group-usecase";

function makeSut() {
  const contatoGrupoRepositoryStub = makeContatoGrupoRepositoryStub();
  const sut = new ReportGroupUsecase(contatoGrupoRepositoryStub);

  return { sut, contatoGrupoRepositoryStub };
}

describe("ReportGroup Usecase", () => {
  test("Should return an array with the report if success", async () => {
    const { sut } = makeSut();

    await expect(sut.execute()).resolves.toEqual(expect.any(Array));
  });

  test("Should throw error if any error occours while generating the report", async () => {
    const { sut, contatoGrupoRepositoryStub } = makeSut();

    jest
      .spyOn(contatoGrupoRepositoryStub, "getGroupContactsReport")
      .mockRejectedValueOnce(new Error("test error"));

    await expect(sut.execute()).rejects.toThrow(new Error("test error"));
  });
});
