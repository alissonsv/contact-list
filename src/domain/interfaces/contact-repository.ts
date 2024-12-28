import { Prisma, Contato } from "@prisma/client";

export interface IContactRepository {
  create(data: Prisma.ContatoCreateInput): Promise<Contato>;
  getAll(page: number): Promise<Contato[]>;
  update(data: Contato): Promise<Contato>;
  deleteById(id: number): Promise<void>;
}
