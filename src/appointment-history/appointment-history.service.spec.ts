import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentHistoryService } from './appointment-history.service';

describe('AppointmentHistoryService', () => {
  let service: AppointmentHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentHistoryService],
    }).compile();

    service = module.get<AppointmentHistoryService>(AppointmentHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
