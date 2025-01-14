import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppointmentRepository } from 'src/appointment/repository/appointment.repository';
import { UpdateAppointmentCommand } from '../update-appointment.command';
import { BadRequestException } from '@nestjs/common';
import { ProcessStatusService } from 'src/process-status/process-status.service';
import { UserService } from 'src/user/user.service';
import { ProcessStatusEnum } from 'src/process-status/interfaces/status.enum';

@CommandHandler(UpdateAppointmentCommand)
export class UpdateAppointmentHandler
  implements ICommandHandler<UpdateAppointmentCommand>
{
  constructor(
    private appointmentRepository: AppointmentRepository,
    private readonly processStatusService: ProcessStatusService,
    private readonly userService: UserService,
  ) {}

  async execute(command: UpdateAppointmentCommand) {
    const { id, updateAppointmentDto, user } = command;
    const { isRescheduled = false } = updateAppointmentDto;

    delete updateAppointmentDto.isFirstTime;

    if (Object.keys(updateAppointmentDto).length === 0) {
      throw new BadRequestException('Campos no encontrado para actualizar');
    }

    const appointment = await this.appointmentRepository.update(
      id,
      updateAppointmentDto,
    );

    const newAppointment = await this.appointmentRepository.findOneById(id);

    if (user.roles.includes('platform-operator')) {
      const user = await this.userService.findOne(newAppointment.reservedBy.id);
      const processStatus =
        await this.processStatusService.findOneByUserSection(
          newAppointment.section.id,
          user,
        );
      await this.processStatusService.update(processStatus.id, {
        isRescheduled,
      });
    } else if (isRescheduled && newAppointment) {
      const user = await this.userService.findOne(newAppointment.reservedBy.id);
      const processStatus =
        await this.processStatusService.findOneByUserSection(
          newAppointment.section.id,
          user,
        );
      await this.processStatusService.update(processStatus.id, {
        status: ProcessStatusEnum.VERIFIED,
        isRescheduled,
      });
    }
    return newAppointment;
  }
}
