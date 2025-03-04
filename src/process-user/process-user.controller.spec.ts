import { Test, TestingModule } from '@nestjs/testing';
import { ProcessUserController } from './process-user.controller';
import { ProcessUserService } from './process-user.service';

describe('ProcessUserController', () => {
  let controller: ProcessUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessUserController],
      providers: [ProcessUserService],
    }).compile();

    controller = module.get<ProcessUserController>(ProcessUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
