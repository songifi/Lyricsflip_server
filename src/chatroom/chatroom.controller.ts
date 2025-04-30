import { Controller, Get, Param } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('chat')
@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Get('/:roomId/messages')
  @ApiOperation({ summary: 'Get chat history for a room' })
  @ApiResponse({ status: 200, description: 'List of messages' })
  async getRoomMessages(@Param('roomId') roomId: string) {
    return this.chatroomService.getRoomMessages(roomId);
  }

  @Get('/:roomId')
  @ApiOperation({ summary: 'Get room information' })
  @ApiResponse({ status: 200, description: 'Room details' })
  async getRoom(@Param('roomId') roomId: string) {
    return this.chatroomService.getRoom(roomId);
  }
}
