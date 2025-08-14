import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { GuessLyricDto } from './dto/guess-lyric.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('create')
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Post(':roomId/join')
  join(
    @Param('roomId') roomId: string,
    @GetUser('id') userId: string,
  ) {
    return this.roomsService.join(roomId, userId);
  }

  @Get(':roomId/status')
  getRoomStatus(
    @Param('roomId') roomId: string,
    @GetUser('id') userId: string,
  ) {
    return this.roomsService.getRoomStatus(roomId, userId);
  }

  @Post(':roomId/guess')
  submitGuess(
    @Param('roomId') roomId: string,
    @GetUser('id') userId: string,
    @Body() guessDto: GuessLyricDto,
  ) {
    return this.roomsService.submitGuess(roomId, userId, guessDto);
  }
}
