import { Test, TestingModule } from '@nestjs/testing';
import { ProcessHistoryService } from './process-history.service';

describe('ProcessHistoryService', () => {
  let service: ProcessHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessHistoryService],
    }).compile();

    service = module.get<ProcessHistoryService>(ProcessHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
