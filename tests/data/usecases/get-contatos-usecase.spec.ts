import { makeContatoRepositoryStub } from "#/tests/mocks/contato-repository-stub";
import { GetContatosUsecase } from "#/data/usecases/get-contatos-usecase";

function makeSut() {
  const contatoRepositoryStub = makeContatoRepositoryStub();
  const sut = new GetContatosUsecase(contatoRepositoryStub);

  return { sut, contatoRepositoryStub };
}

describe("GetContatos Usecase", () => {
  test("Should get a list of contacts", async () => {
    const { sut } = makeSut();
    const contactsResult = await sut.execute(1);

    expect(Array.isArray(contactsResult)).toBe(true);
    expect(contactsResult.length).toBe(2);
  });

  test("Should throw any error if contatoRepository throws", async () => {
    const { sut, contatoRepositoryStub } = makeSut();
    jest
      .spyOn(contatoRepositoryStub, "getAll")
      .mockRejectedValueOnce(new Error("test error"));

    await expect(() => sut.execute(1)).rejects.toThrow(new Error("test error"));
  });
});
