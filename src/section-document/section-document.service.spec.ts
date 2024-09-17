import { Test, TestingModule } from '@nestjs/testing';
import { SectionDocumentService } from './section-document.service';

describe('SectionDocumentService', () => {
  let service: SectionDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SectionDocumentService],
    }).compile();

    service = module.get<SectionDocumentService>(SectionDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
