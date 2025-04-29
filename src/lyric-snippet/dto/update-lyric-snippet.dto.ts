import { PartialType } from '@nestjs/swagger';
import { CreateLyricSnippetDto } from './create-lyric-snippet.dto';

export class UpdateLyricSnippetDto extends PartialType(CreateLyricSnippetDto) {}
