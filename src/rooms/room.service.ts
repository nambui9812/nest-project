import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { CreateRoomDTO } from './room.dto';
import { Room } from './room.entity';
import { Member, ROLE, STATUS } from '../members/member.entity';
import { AuthUser } from 'src/configs/auth';
import { relative } from 'path';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>
  ) {}

  async findAll(): Promise<Room[]> {
		return this.roomRepository.find();
	}

  async findAndJoinById(currentUser: AuthUser, id: number) {
    const foundRoom = await this.roomRepository.findOne({
			where: { id },
      relations: { members: true }
		});

		if (!foundRoom) throw new NotFoundException('Room not found');

    const members = foundRoom.members.filter((member) => member.userId === currentUser.sub);

    if (members.length === 0) {
      await this.memberRepository.save({
        role: ROLE.user,
        status: STATUS.active,
        userId: currentUser.sub,
        roomId: id
      });

      return foundRoom;
    }

    const currentMember = members[0];

    if (currentMember.status === STATUS.banned) throw new UnauthorizedException('Was banned');
    return foundRoom;
  }

  async findAndJoinByUrl(currentUser: AuthUser, url: string) {
    const foundRoom = await this.roomRepository.findOne({
			where: { url },
      relations: { members: true }
		});

		if (!foundRoom) throw new NotFoundException('Room not found');

    const members = foundRoom.members.filter((member) => member.userId === currentUser.sub);

    if (members.length === 0) {
      await this.memberRepository.save({
        role: ROLE.user,
        status: STATUS.active,
        userId: currentUser.sub,
        roomId: foundRoom.id
      });

      return foundRoom;
    }

    const currentMember = members[0];

    if (currentMember.status === STATUS.banned) throw new UnauthorizedException('Was banned');
    return foundRoom;
  }

	async create(currentUser: AuthUser, createRoomDto: CreateRoomDTO): Promise<Room> {
    const userId = currentUser.sub;
    const { name, description } = createRoomDto;

    const newRoom = await this.roomRepository.save({ name, description, url: v4() });

    const newMember = {
      role: ROLE.owner,
      status: STATUS.active,
      userId,
      roomId: newRoom.id
    }

    await this.memberRepository.save(newMember);

		return newRoom;
	}

	async deleteById(currentUser: AuthUser, id: number) {
		const foundRoom = await this.roomRepository.findOne({
      where: { id },
      relations: { members: true }
    });

    const role = foundRoom.members.filter((member) => member.userId === currentUser.sub)[0].role;

    if (role != ROLE.owner) throw new UnauthorizedException('Not own');

    await this.memberRepository.remove(foundRoom.members);
		return this.roomRepository.remove(foundRoom);
	}

  async leaveRoomById(currentUser: AuthUser, id: number) {
    const foundRoom = await this.roomRepository.findOne({
      where: { id },
      relations: { members: true }
    });

    if (!foundRoom) throw new NotFoundException('Room not found');

    const members = foundRoom.members.filter((member) => member.userId === currentUser.sub);

    if (members.length === 0) throw new NotFoundException('Not join yet');

    const currentMember = members[0];

    if (currentMember.status === STATUS.banned) throw new UnauthorizedException('Was banned');

    return this.memberRepository.remove(currentMember);
  }

  // TODO: Need to rewrite all

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
      where: { role: ROLE.mod, userId },
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
      where: { role: ROLE.mod, roomId },
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
