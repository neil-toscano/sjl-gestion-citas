import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentHistoryController } from './appointment-history.controller';
import { AppointmentHistoryService } from './appointment-history.service';

describe('AppointmentHistoryController', () => {
  let controller: AppointmentHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentHistoryController],
      providers: [AppointmentHistoryService],
    }).compile();

    controller = module.get<AppointmentHistoryController>(
      AppointmentHistoryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
