import { Test, TestingModule } from '@nestjs/testing';
import { ProcessStatusController } from './process-status.controller';
import { ProcessStatusService } from './process-status.service';

describe('ProcessStatusController', () => {
  let controller: ProcessStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessStatusController],
      providers: [ProcessStatusService],
    }).compile();

    controller = module.get<ProcessStatusController>(ProcessStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
