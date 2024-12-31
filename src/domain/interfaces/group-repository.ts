import { Grupo, Prisma } from "@prisma/client";

export interface IGroupRepository {
  create(data: Prisma.GrupoCreateInput): Promise<Grupo>;
  read(id: number): Promise<Grupo | null>;
  update(data: Grupo): Promise<Grupo>;
  deleteById(id: number): Promise<void>;
}
