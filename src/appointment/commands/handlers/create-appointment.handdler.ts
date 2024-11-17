import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAppointmentCommand } from '../create-appointment.command';
import { AppointmentRepository } from 'src/appointment/repository/appointment.repository';
import { SectionDocumentService } from 'src/section-document/section-document.service';
import { ScheduleService } from 'src/schedule/schedule.service';
import { UserPermissionsService } from 'src/user-permissions/user-permissions.service';
import { NotFoundException } from '@nestjs/common';
import { ProcessStatusService } from 'src/process-status/process-status.service';
import { ProcessStatusEnum } from 'src/process-status/interfaces/status.enum';
import { EmailService } from 'src/email/email.service';

@CommandHandler(CreateAppointmentCommand)
export class CreateAppointmentHandler
  implements ICommandHandler<CreateAppointmentCommand>
{
  constructor(
    private appointmentRepository: AppointmentRepository,
    private readonly sectionService: SectionDocumentService,
    private readonly scheduleService: ScheduleService,
    private readonly userPermissionsService: UserPermissionsService,
    private readonly processStatusService: ProcessStatusService,
    private readonly emailService: EmailService,
  ) {}

  async execute(command: CreateAppointmentCommand) {
    const { createAppointmentDto, scheduleId, sectionId, user } = command;

    const section = await this.sectionService.findOne(sectionId);
    const schedule = await this.scheduleService.findOne(scheduleId);

    const checkEligibility =
      await this.processStatusService.checkEligibilityForAppointment(
        sectionId,
        user,
      );
    if (!checkEligibility.hasProcess) {
      throw new NotFoundException('No tiene ningún proceso');
    }

    const appointment =
      await this.appointmentRepository.getOpenAppointmentBySectionAndUser(
        sectionId,
        user.id,
      );

    if (appointment) {
      return {
        ok: true,
        msg: 'Ya tiene reserva en la sección',
        appointment,
      };
    }

    const maxUsersPerProcess: string = process.env.MAXUSERS;
    const platformUsers =
      await this.userPermissionsService.findPlatformOperators(sectionId);
    const totalMaxUsersPerProcess =
      parseInt(maxUsersPerProcess) * platformUsers.length;

    const appointments = await this.appointmentRepository.isScheduleAvailable(
      scheduleId,
      createAppointmentDto.appointmentDate,
      sectionId,
    );

    if (appointments.length >= totalMaxUsersPerProcess) {
      throw new NotFoundException(
        `El horario para dicha fecha ya se encuentra reservado para el número máximo de operadores`,
      );
    }

    const newAppointment = this.appointmentRepository.create(
      sectionId,
      scheduleId,
      createAppointmentDto,
      user,
    );

    const processStatus = await this.processStatusService.findOneByUserSection(
      sectionId,
      user,
      true,
    );

    await this.processStatusService.update(processStatus.id, {
      status: ProcessStatusEnum.APPOINTMENT_SCHEDULED,
    });

    await this.emailService.sendAppointmentConfirmation({
      isFirstTime: createAppointmentDto.isFirstTime,
      appointmentDate: createAppointmentDto.appointmentDate,
      appointmentTime: `${schedule.startTime} - ${schedule.endTime}`,
      email: user.email,
      person: `PERSONAL DE LA MUNICIPALIDAD `,
      service: section.sectionName,
      recipientName: `${user.firstName} ${user.apellido_paterno}`,
    });

    return newAppointment;
  }
}
