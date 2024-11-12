import { Test, TestingModule } from '@nestjs/testing';
import { ProcessHistoryController } from './process-history.controller';
import { ProcessHistoryService } from './process-history.service';

describe('ProcessHistoryController', () => {
  let controller: ProcessHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessHistoryController],
      providers: [ProcessHistoryService],
    }).compile();

    controller = module.get<ProcessHistoryController>(ProcessHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
