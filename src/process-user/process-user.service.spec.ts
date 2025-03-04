import { Test, TestingModule } from '@nestjs/testing';
import { ProcessUserService } from './process-user.service';

describe('ProcessUserService', () => {
  let service: ProcessUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessUserService],
    }).compile();

    service = module.get<ProcessUserService>(ProcessUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
