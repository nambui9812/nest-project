import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { Room } from './room.entity';
import { CreateRoomDTO, UserRoomDTO } from './room.dto';
import { Member, ROLE } from '../members/member.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly memberRepository: Repository<Member>
  ) {}

  async findAll(): Promise<Room[]> {
		return this.roomRepository.find();
	}

	async findById(id: number): Promise<Room> {
		const foundRoom = await this.roomRepository.findOne({
			where: { id }
		});

		if (!foundRoom) throw new Error('Room not found');
		return foundRoom;
	}

  async findByUrl(url: string): Promise<Room> {
		const foundRoom = await this.roomRepository.findOne({
			where: { url }
		});

		if (!foundRoom) throw new Error('Room not found');
		return foundRoom;
	}

	async create(createRoomDto: CreateRoomDTO): Promise<Room> {
    const { userId, name } = createRoomDto;

    const newRoom = await this.roomRepository.save({ name, url: v4() });

    await this.memberRepository.save({
      role: ROLE.owner,
      userId,
      room_id: newRoom.id
    });

		return newRoom;
	}

	async deleteById(id: number) {
		const foundRoom = await this.findById(id);
    
    const foundMember = await this.memberRepository.findOne({
      where: { roomId: id }
    });

    await this.memberRepository.remove(foundMember);

		return this.roomRepository.remove(foundRoom);
	}

  async joinRoom(userRoomDto: UserRoomDTO) {
    const { userId, roomId } = userRoomDto;

    // Check if already join
    const foundMember = await this.memberRepository.findOne({
      where: { userId, roomId }
    });

    if (foundMember) return;

    return this.memberRepository.save({
      userId,
      roomId
    });
  }

  async leaveRoom(userRoomDto: UserRoomDTO) {
    const { userId, roomId } = userRoomDto;

    // Check if already join
    const foundMember = await this.memberRepository.findOne({
      where: { userId, roomId }
    });

    if (!foundMember) return;

    return this.memberRepository.remove(foundMember);
  }

  async findRoomsByUserId(userId: number) {
    const foundMembers = await this.memberRepository.find({
      where: { userId },
      relations: { room: true }
    });

    return foundMembers.map((member) => member.room);
  }

  async findRoomsAsOwnerByUserId(userId: number) {
    const foundMembers = await this.memberRepository.find({
      where: { role: ROLE.owner, userId },
      relations: { room: true }
    });

    return foundMembers.map((member) => member.room);
  }

  async findRoomsAsAdminByUserId(userId: number) {
    const foundMembers = await this.memberRepository.find({
      where: { role: ROLE.admin, userId },
      relations: { room: true }
    });

    return foundMembers.map((member) => member.room);
  }

  async findRoomsAsUserByUserId(userId: number) {
    const foundMembers = await this.memberRepository.find({
      where: { role: ROLE.user, userId },
      relations: { room: true }
    });

    return foundMembers.map((member) => member.room);
  }

  async findMembersByRoomId(roomId: number) {
    const foundMembers = await this.memberRepository.find({
      where: { roomId },
      relations: { user: true }
    });

    return foundMembers.map((member) => member.user);
  }

  async findOwnerByRoomId(roomId: number) {
    const foundMember = await this.memberRepository.findOne({
      where: { role: ROLE.owner, roomId },
      relations: { user: true }
    });

    return foundMember.user;
  }

  async findAdminsByRoomId(roomId: number) {
    const foundMember = await this.memberRepository.find({
      where: { role: ROLE.admin, roomId },
      relations: { user: true }
    });

    return foundMember.map((member) => member.user);
  }

  async findUsersByRoomId(roomId: number) {
    const foundMember = await this.memberRepository.find({
      where: { role: ROLE.user, roomId },
      relations: { user: true }
    });

    return foundMember.map((member) => member.user);
  }
}
