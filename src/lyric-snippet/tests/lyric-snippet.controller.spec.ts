import { Test, TestingModule } from '@nestjs/testing';
import { LyricSnippetController } from './lyric-snippet.controller';
import { LyricSnippetService } from './lyric-snippet.service';

describe('LyricSnippetController', () => {
  let controller: LyricSnippetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LyricSnippetController],
      providers: [LyricSnippetService],
    }).compile();

    controller = module.get<LyricSnippetController>(LyricSnippetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
