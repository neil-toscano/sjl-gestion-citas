import { CreateAppointmentHandler } from './create-appointment.handdler';
import { RemoveAppointmentHandler } from './remove-appointment.handler';
import { UpdateAppointmentHandler } from './update-appointment.handler';

export const CommandHandlers = [
  CreateAppointmentHandler,
  RemoveAppointmentHandler,
  UpdateAppointmentHandler,
];
