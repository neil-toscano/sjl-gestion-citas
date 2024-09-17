import { Test, TestingModule } from '@nestjs/testing';
import { SectionTypeDocumentService } from './section-type-document.service';

describe('SectionTypeDocumentService', () => {
  let service: SectionTypeDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SectionTypeDocumentService],
    }).compile();

    service = module.get<SectionTypeDocumentService>(
      SectionTypeDocumentService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
