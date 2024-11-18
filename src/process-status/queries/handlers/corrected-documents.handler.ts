import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProcessStatusRepository } from 'src/process-status/repository/process-status.repository';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { CorrectedDocumentsQuery } from '../corrected-documents.query';

@QueryHandler(CorrectedDocumentsQuery)
export class CorrectedDocumentsStatusHandler
  implements IQueryHandler<CorrectedDocumentsQuery>
{
  constructor(
    private readonly processStatusRepository: ProcessStatusRepository,
    private readonly assignmentService: AssignmentsService,
  ) {}

  async execute(query: CorrectedDocumentsQuery) {
    const { sectionId, admin } = query;

    await this.assignmentService.remove(admin.id);
    const assignedUsers =
      await this.assignmentService.findAllBySection(sectionId);

    const assignedUserIds = assignedUsers.map((a) => a.user.id);

    const completedProcessStatus =
      await this.processStatusRepository.getAllUsersWithCorrectedDocuments(
        sectionId,
        assignedUserIds,
      );

    return completedProcessStatus;
  }
}
