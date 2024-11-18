import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCompletedStatusQuery } from '../list-completed-status.query';
import { ProcessStatusRepository } from 'src/process-status/repository/process-status.repository';
import { AssignmentsService } from 'src/assignments/assignments.service';

@QueryHandler(ListCompletedStatusQuery)
export class ListCompletedStatusHandler
  implements IQueryHandler<ListCompletedStatusQuery>
{
  constructor(
    private readonly processStatusRepository: ProcessStatusRepository,
    private readonly assignmentService: AssignmentsService,
  ) {}

  async execute(query: ListCompletedStatusQuery) {
    const { sectionId, admin } = query;

    await this.assignmentService.remove(admin.id);
    const assignedUsers =
      await this.assignmentService.findAllBySection(sectionId);

    const assignedUserIds = assignedUsers.map((a) => a.user.id);

    const completedProcessStatus =
      await this.processStatusRepository.getCompletedProcessStatus(
        sectionId,
        assignedUserIds,
      );

    return completedProcessStatus;
  }
}
