import { validate } from 'class-validator';
import { UpdateUserPreferencesDto } from './update-user-preferences.dto';
import { MusicGenre, MusicDecade } from '../entities/user.entity';

describe('UpdateUserPreferencesDto', () => {
  it('should be valid with valid genre and decade', async () => {
    const dto = new UpdateUserPreferencesDto();
    dto.preferredGenre = MusicGenre.POP;
    dto.preferredDecade = MusicDecade.NINETIES;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with only genre', async () => {
    const dto = new UpdateUserPreferencesDto();
    dto.preferredGenre = MusicGenre.ROCK;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with only decade', async () => {
    const dto = new UpdateUserPreferencesDto();
    dto.preferredDecade = MusicDecade.EIGHTIES;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with no preferences', async () => {
    const dto = new UpdateUserPreferencesDto();

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be invalid with invalid genre', async () => {
    const dto = new UpdateUserPreferencesDto();
    dto.preferredGenre = 'Invalid Genre' as MusicGenre;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.isEnum).toBeDefined();
  });

  it('should be invalid with invalid decade', async () => {
    const dto = new UpdateUserPreferencesDto();
    dto.preferredDecade = '1950s' as MusicDecade;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.isEnum).toBeDefined();
  });

  it('should be invalid with both invalid values', async () => {
    const dto = new UpdateUserPreferencesDto();
    dto.preferredGenre = 'Invalid Genre' as MusicGenre;
    dto.preferredDecade = '1950s' as MusicDecade;

    const errors = await validate(dto);
    expect(errors).toHaveLength(2);
    expect(errors[0].constraints?.isEnum).toBeDefined();
    expect(errors[1].constraints?.isEnum).toBeDefined();
  });
});
