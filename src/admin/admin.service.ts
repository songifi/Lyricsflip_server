import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LyricsService } from 'src/lyrics/lyrics.service';

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private lyricsService: LyricsService,
  ) {}

  findAllUsers() {
    return this.usersService.findAll();
  }

  async deleteUser(id: string) {
    const result = await this.usersService.remove(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return { message: `User with ID ${id} deleted successfully.` };
  }

  findAllLyrics() {
    return this.lyricsService.findAll();
  }

  deleteLyric(id: string) {
    return this.lyricsService.remove(id);
  }
}
