import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDTO, UserRoomDTO } from './room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async getAll() {
    const rooms = await this.roomService.findAll();
    return rooms;
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    const foundRoom = await this.roomService.findById(id);
    return foundRoom;
  }

  @Get('room/:url')
  async getByUrl(@Param('url') url: string) {
    const foundRoom = await this.roomService.findByUrl(url);
    return foundRoom;
  }

  @Post()
  async createRoom(@Body() createRoomDto: CreateRoomDTO) {
    const newRoom = this.roomService.create(createRoomDto);
    return newRoom;
  }

  @Post('room/join')
  async joinRoom(@Body() userRoomDto: UserRoomDTO) {
    await this.roomService.joinRoom(userRoomDto);
    return {
      message: 'Room joined'
    };
  }

  @Delete('room/leave')
  async leaveRoom(@Body() userRoomDto: UserRoomDTO) {
    await this.roomService.leaveRoom(userRoomDto);
    return {
      message: 'Room left'
    };
  }

  @Delete(':id')
  async deleteById(@Param('id') id: number) {
    await this.roomService.deleteById(id);
		return {
			message: 'Room deleted'
		};
  }
}
