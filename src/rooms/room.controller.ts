import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { RoomService } from './room.service';
import { CreateRoomDTO } from './room.dto';
import { AuthUser, Public } from '../configs/auth';
import { GetResponse } from '../configs/response';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

	// TODO: For current dev process only, need to add authority check after add admin
  @Public()
  @Get()
  async getAll() {
    const rooms = await this.roomService.findAll();
    return rooms;
  }

  @Get(':id')
  async getById(@Req() req: Request, @Param('id') id: number) {
    const currentUser = req['user'] as AuthUser;
    const foundRoom = await this.roomService.findAndJoinById(currentUser, id);
    return foundRoom;
  }

  @Get('room/:url')
  async getByUrl(@Req() req: Request, @Param('url') url: string) {
    const currentUser = req['user'] as AuthUser;
    const foundRoom = await this.roomService.findAndJoinByUrl(currentUser, url);
    return foundRoom;
  }

  @Post()
  async createRoom(@Req() req: Request, @Body() createRoomDto: CreateRoomDTO) {
    const currentUser = req['user'] as AuthUser;
    const newRoom = this.roomService.create(currentUser, createRoomDto);
    return newRoom;
  }

  @Delete(':id')
  async deleteById(@Req() req: Request, @Param('id') id: number) {
    const currentUser = req['user'] as AuthUser;
    await this.roomService.deleteById(currentUser, id);

		return GetResponse({
			message: 'Room deleted'
		});
  }

  @Get('room/leave/:id')
  async leaveRoom(@Req() req: Request, @Param('id') id: number) {
    const currentUser = req['user'] as AuthUser;
    await this.roomService.leaveRoomById(currentUser, id);
    return GetResponse({
      message: 'Room left'
    });
  }
}
