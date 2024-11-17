import { GetAppointmentsByWeekHandler } from './fin-appointment-week.handler';
import { FindByFilterAppointmentHandler } from './find-appointment-filter.handler';
import { FindOneAppointmentHandler } from './find-one.handler';
import { HasOpenAppointmentHandler } from './hasOpen-appointment.handler';
import { ListAppointmentHandler } from './list-appointment.handler';
import { ListExpiredAppointmentsHandler } from './list-expired-appointments.handler';

export const QueryHandlers = [
  HasOpenAppointmentHandler,
  FindByFilterAppointmentHandler,
  GetAppointmentsByWeekHandler,
  ListAppointmentHandler,
  ListExpiredAppointmentsHandler,
  FindOneAppointmentHandler,
];
