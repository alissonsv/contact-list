import { IContactRepository } from "#/domain/interfaces/contact-repository";

export class GetContatosUsecase {
  constructor(private contatoRepository: IContactRepository) {}

  async execute(page: number) {
    return this.contatoRepository.getAll(page);
  }
}
