import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { GuessDto } from './dto/guess.dto';

@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('create')
  create(@Body() dto: CreateRoomDto) {
    return this.roomsService.create(dto);
  }

  @Post(':roomId/join')
  join(
    @Request() req,
    @Param('roomId') roomId: string,
    @Body() dto: JoinRoomDto,
  ) {
    dto.roomId = roomId;
    return this.roomsService.join(req.user.id, dto);
  }

  @Get(':roomId/status')
  status(@Param('roomId') roomId: string) {
    return this.roomsService.status(roomId);
  }

  @Post(':roomId/guess')
  guess(
    @Request() req,
    @Param('roomId') roomId: string,
    @Body() dto: GuessDto,
  ) {
    dto.roomId = roomId;
    return this.roomsService.guess(req.user.id, dto);
  }
}
