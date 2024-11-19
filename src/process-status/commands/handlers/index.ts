import { CreateProcessStatusHandler } from './create-process-status.handler';
import { RemoveProcessStatusHandler } from './remove-process-status.handler';
import { UpdateProcessStatusHandler } from './update-process-status.handler';

export const CommandHandlers = [
  RemoveProcessStatusHandler,
  UpdateProcessStatusHandler,
  CreateProcessStatusHandler,
];
