import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProcessStatusRepository } from 'src/process-status/repository/process-status.repository';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { UnresolvedDocumentsQuery } from '../unresolved-documents.query';

@QueryHandler(UnresolvedDocumentsQuery)
export class UnresolvedDocumentsHandler
  implements IQueryHandler<UnresolvedDocumentsQuery>
{
  constructor(
    private readonly processStatusRepository: ProcessStatusRepository,
    private readonly assignmentService: AssignmentsService,
  ) {}

  async execute(query: UnresolvedDocumentsQuery) {
    const { sectionId, admin } = query;
    await this.assignmentService.remove(admin.id);
    const assignedUsers =
      await this.assignmentService.findAllBySection(sectionId);

    const assignedUserIds = assignedUsers.map((a) => a.user.id);
    const users =
      await this.processStatusRepository.getAllUsersWithUnresolvedDocuments(
        sectionId,
        assignedUserIds,
      );

    return users;
  }
}
