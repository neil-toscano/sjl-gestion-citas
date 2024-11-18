import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProcessStatusRepository } from 'src/process-status/repository/process-status.repository';
import { CheckEligibilityQuery } from '../check-eligibility.query';
import { TimeRemaining } from 'src/process-status/interfaces/time-remaining';
import { getTimeRemaining } from 'src/process-status/utils/time.util';

@QueryHandler(CheckEligibilityQuery)
export class CheckEligibilityHandler
  implements IQueryHandler<CheckEligibilityQuery>
{
  constructor(
    private readonly processStatusRepository: ProcessStatusRepository,
  ) {}

  async execute(query: CheckEligibilityQuery) {
    const { sectionId, user } = query;

    const processStatus =
      await this.processStatusRepository.checkEligibilityForAppointment(
        sectionId,
        user,
      );
    let timeRemaining: TimeRemaining;

    if (processStatus) {
      timeRemaining = getTimeRemaining(processStatus.updatedAt);
    } else {
      timeRemaining = { expired: false, days: 0, hours: 0, minutes: 0 };
    }
    return {
      hasProcess: processStatus ? true : false,
      processStatus: processStatus,
      timeRemaining: timeRemaining,
    };
  }
}
