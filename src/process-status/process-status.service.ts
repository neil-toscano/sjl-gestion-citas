import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  RemoveProcessStatusCommand,
  UpdateProcessStatusCommand,
  CreateProcessStatusCommand,
} from './commands';

import {
  CheckEligibilityQuery,
  CountByStatusQuery,
  FindOneByUserSectionQuery,
  ObservedDocumentsQuery,
  UnresolvedDocumentsQuery,
  ListCompletedStatusQuery,
  NextUserCorrectedDocumentsQuery,
  CorrectedDocumentsQuery,
  NextUserForReviewQuery,
} from './queries';

import { UpdateProcessStatusDto } from './dto/update-process-status.dto';
import { CreateProcessStatusDto } from './dto/create-process-status.dto';
import { CheckStatusQuery } from './queries/checkStatus.query';

@Injectable()
export class ProcessStatusService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async create(createProcessStatusDto: CreateProcessStatusDto, user: User) {
    return this.commandBus.execute(
      new CreateProcessStatusCommand(createProcessStatusDto, user),
    );
  }

  async findUsersWithCompletedDocuments(sectionId: string, admin: User) {
    return this.queryBus.execute(
      new ListCompletedStatusQuery(admin, sectionId),
    );
  }

  async findNextUserForReview(sectionId: string, adminId: string) {
    return this.queryBus.execute(
      new NextUserForReviewQuery(sectionId, adminId),
    );
  }

  async getAllUsersWithCorrectedDocuments(sectionId: string, admin: User) {
    return this.queryBus.execute(new CorrectedDocumentsQuery(sectionId, admin));
  }

  async NextUserCorrected(sectionId: string, adminId: string) {
    return this.queryBus.execute(
      new NextUserCorrectedDocumentsQuery(sectionId, adminId),
    );
  }

  async getAllUsersWithUnresolvedDocuments(sectionId: string, admin: User) {
    return this.queryBus.execute(
      new UnresolvedDocumentsQuery(sectionId, admin),
    );
  }

  async getAllUsersWithObservedDocuments() {
    return this.queryBus.execute(new ObservedDocumentsQuery());
  }

  async checkEligibilityForAppointment(sectionId: string, user: User) {
    return this.queryBus.execute(new CheckEligibilityQuery(sectionId, user));
  }

  async processStatusByUserSection(sectionId: string, userId: string) {
    return this.queryBus.execute(new CheckStatusQuery(sectionId, userId));
  }

  async countByStatus() {
    return this.queryBus.execute(new CountByStatusQuery());
  }

  async findOneByUserSection(
    sectionId: string,
    user: User,
    throwErrorIfNotFound = true,
  ) {
    return this.queryBus.execute(
      new FindOneByUserSectionQuery(sectionId, user, throwErrorIfNotFound),
    );
  }

  async update(id: string, updateProcessStatusDto: UpdateProcessStatusDto) {
    return this.commandBus.execute(
      new UpdateProcessStatusCommand(id, updateProcessStatusDto),
    );
  }

  async remove(id: string) {
    return this.commandBus.execute(new RemoveProcessStatusCommand(id));
  }
}
