import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProcessStatusRepository } from 'src/process-status/repository/process-status.repository';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { NextUserForReviewQuery } from '../next-user-review.query';

@QueryHandler(NextUserForReviewQuery)
export class NextUserForReviewHandler
  implements IQueryHandler<NextUserForReviewQuery>
{
  constructor(
    private readonly processStatusRepository: ProcessStatusRepository,
    private readonly assignmentService: AssignmentsService,
  ) {}

  async execute(query: NextUserForReviewQuery) {
    const { adminId, sectionId } = query;

    await this.assignmentService.remove(adminId);
    const assignedUsers =
      await this.assignmentService.findAllBySection(sectionId);

    const assignedUserIds = assignedUsers.map((a) => a.user.id);
    const userForReview = await this.processStatusRepository.findOneForReview(
      sectionId,
      assignedUserIds,
    );
    if (!userForReview) {
      return [];
    }

    await this.assignmentService.create(
      {
        sectionDocumentId: sectionId,
        userId: userForReview.user.id,
      },
      adminId,
    );
    return [userForReview];
  }
}
