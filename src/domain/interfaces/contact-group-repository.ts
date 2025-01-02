import { Contato } from "@prisma/client";

export interface GroupContactsReportResponse {
  grupo: string;
  quantidade_contatos: number;
}

export interface IContactGroupRepository {
  insertContactsIntoGroup(contactId: number[], groupId: number): Promise<void>;
  deleteContactsFromGroup(contactId: number[], groupId: number): Promise<void>;
  listGroupContacts(groupId: number, page: number): Promise<Contato[]>;
  getGroupContactsReport(): Promise<GroupContactsReportResponse[]>;
}
