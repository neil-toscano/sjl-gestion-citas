import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { User } from 'src/user/entities/user.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { FilterAppointmentDto } from './dto/filter-appointment.dto';
import {
  CreateAppointmentCommand,
  RemoveAppointmentCommand,
  UpdateAppointmentCommand,
} from './commands';
import {
  HasOpenAppointmentQuery,
  FindByFilterAppointmentQuery,
  FindOneAppointmentQuery,
  ListExpiredAppointmentsQuery,
  ListAppointmentQuery,
  GetAppointmentsByWeekQuery,
} from './queries';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(
    sectionId: string,
    scheduleId: string,
    createAppointmentDto: CreateAppointmentDto,
    user: User,
  ) {
    return this.commandBus.execute(
      new CreateAppointmentCommand(
        sectionId,
        scheduleId,
        createAppointmentDto,
        user,
      ),
    );
  }

  findAll(user: User, sectionId: string) {
    return this.queryBus.execute(new ListAppointmentQuery(user, sectionId));
  }

  async findByFilter(filterAppointmentDto: FilterAppointmentDto) {
    return this.queryBus.execute(
      new FindByFilterAppointmentQuery(filterAppointmentDto),
    );
  }

  async findByWeek(date: Date, sectionId: string) {
    return this.queryBus.execute(
      new GetAppointmentsByWeekQuery(date, sectionId),
    );
  }

  async findOne(id: string) {
    return this.queryBus.execute(new FindOneAppointmentQuery(id));
  }

  async removeByUser(userId: string, sectionId: string) {
    return this.commandBus.execute(
      new RemoveAppointmentCommand(sectionId, userId),
    );
  }

  async hasOpenAppointmentBySection(sectionId: string, userId: string) {
    return this.commandBus.execute(
      new HasOpenAppointmentQuery(sectionId, userId),
    );
  }

  async expiredAppointments() {
    return this.commandBus.execute(new ListExpiredAppointmentsQuery());
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    return this.commandBus.execute(
      new UpdateAppointmentCommand(id, updateAppointmentDto),
    );
  }
}
