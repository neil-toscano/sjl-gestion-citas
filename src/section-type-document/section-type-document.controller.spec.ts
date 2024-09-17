import { Test, TestingModule } from '@nestjs/testing';
import { SectionTypeDocumentController } from './section-type-document.controller';
import { SectionTypeDocumentService } from './section-type-document.service';

describe('SectionTypeDocumentController', () => {
  let controller: SectionTypeDocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SectionTypeDocumentController],
      providers: [SectionTypeDocumentService],
    }).compile();

    controller = module.get<SectionTypeDocumentController>(
      SectionTypeDocumentController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
