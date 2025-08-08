import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { RoomUser } from './entities/room-user.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { GuessDto } from './dto/guess.dto';
import { Lyric } from '../lyrics/lyrics.entity';
import { User } from '../users/user.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private readonly roomsRepo: Repository<Room>,
    @InjectRepository(RoomUser) private readonly ruRepo: Repository<RoomUser>,
    @InjectRepository(Lyric) private readonly lyricsRepo: Repository<Lyric>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateRoomDto): Promise<Room> {
    const lyric = await this.lyricsRepo.findOneBy({ id: dto.lyricId });
    if (!lyric) throw new NotFoundException('Lyric not found');
    const expiresAt = dto.expiresAt
      ? new Date(dto.expiresAt)
      : new Date(Date.now() + 24 * 60 * 60 * 1000);
    const room = this.roomsRepo.create({ lyric, expiresAt });
    return this.roomsRepo.save(room);
  }

  async join(userId: string, dto: JoinRoomDto): Promise<RoomUser> {
    const room = await this.roomsRepo.findOneBy({ id: dto.roomId });
    if (!room) throw new NotFoundException('Room not found');
    const user = await this.usersRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');
    const exists = await this.ruRepo.findOne({
      where: { user: { id: userId }, room: { id: dto.roomId } },
    });
    if (exists) throw new BadRequestException('Already joined');
    const ru = this.ruRepo.create({ user, room });
    return this.ruRepo.save(ru);
  }

  async status(roomId: string): Promise<Room> {
    const room = await this.roomsRepo.findOne({
      where: { id: roomId },
      relations: ['participants', 'lyric'],
    });
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async guess(userId: string, dto: GuessDto): Promise<RoomUser> {
    const ru = await this.ruRepo.findOne({
      where: { user: { id: userId }, room: { id: dto.roomId } },
      relations: ['room', 'room.lyric'],
    });
    if (!ru) throw new NotFoundException('User has not joined room');
    if (ru.hasGuessed) throw new BadRequestException('Already guessed');

    const target = ru.room.lyric.content.trim().toLowerCase();
    const attempt = dto.guess.trim().toLowerCase();
    ru.guess = dto.guess;
    ru.score = attempt === target
      ? 10
      : target.includes(attempt)
      ? 5
      : 0;
    ru.hasGuessed = true;
    await this.ruRepo.save(ru);

    // Optional expiry when all have guessed
    const pending = await this.ruRepo.count({
      where: { room: { id: dto.roomId }, hasGuessed: false },
    });
    if (pending === 0) {
      await this.roomsRepo.update(dto.roomId, { expiresAt: new Date() });
    }

    return ru;
  }
}
