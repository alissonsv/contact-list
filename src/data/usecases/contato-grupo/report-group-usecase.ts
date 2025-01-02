import {
  GroupContactsReportResponse,
  IContactGroupRepository,
} from "#/domain/interfaces/contact-group-repository";

export class ReportGroupUsecase {
  constructor(
    private readonly contactGroupRepository: IContactGroupRepository,
  ) {}

  async execute(): Promise<GroupContactsReportResponse[]> {
    return this.contactGroupRepository.getGroupContactsReport();
  }
}
