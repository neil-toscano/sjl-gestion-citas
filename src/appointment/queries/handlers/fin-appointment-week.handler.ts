import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AppointmentRepository } from 'src/appointment/repository/appointment.repository';
import { GetAppointmentsByWeekQuery } from '../find-appointment-week.handler';
import { UserPermissionsService } from 'src/user-permissions/user-permissions.service';
import { SectionDocumentService } from 'src/section-document/section-document.service';
import { ScheduleService } from 'src/schedule/schedule.service';
import { EstadoDisponibilidad } from 'src/appointment/interfaces/availability.enum';

@QueryHandler(GetAppointmentsByWeekQuery)
export class GetAppointmentsByWeekHandler
  implements IQueryHandler<GetAppointmentsByWeekQuery>
{
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly userPermissionsService: UserPermissionsService,
    private readonly sectionService: SectionDocumentService,
    private readonly scheduleService: ScheduleService,
  ) {}

  async execute(query: GetAppointmentsByWeekQuery) {
    const { date, sectionId } = query;

    const maxUsersPerProcess: string = process.env.MAXUSERS;
    await this.sectionService.findOne(sectionId);

    const platformUsers =
      await this.userPermissionsService.findPlatformOperators(sectionId);

    const totalMaxUsersPerProcess =
      parseInt(maxUsersPerProcess) * platformUsers.length;

    const schedules = await this.scheduleService.findAll();

    const appointments =
      await this.appointmentRepository.getAppointmentCountBySchedule(
        date,
        sectionId,
      );

    const schedulesWithStatus = schedules
      .filter((schedule) => {
        const dayOfWeek = new Date(date).getUTCDay(); //0 Domingo 1 Lunes
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          return (
            schedule.startTime >= '15:00:00' && schedule.endTime <= '17:00:00'
          );
        } else if (dayOfWeek === 6) {
          return (
            schedule.startTime >= '08:00:00' && schedule.endTime <= '12:00:00'
          );
        }
        return false;
      })
      .map((schedule) => {
        const appointmentsCount =
          appointments.find((r) => r.scheduleId === schedule.id)
            ?.appointmentsCount || 0;

        const isAvailable = appointmentsCount < totalMaxUsersPerProcess;

        return {
          scheduleId: schedule.id,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          status: isAvailable
            ? EstadoDisponibilidad.DISPONIBLE
            : EstadoDisponibilidad.NO_DISPONIBLE,
          appointmentsCount,
        };
      });

    return schedulesWithStatus;
  }
}
