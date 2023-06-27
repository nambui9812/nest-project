import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './channel.entity';
import { Repository } from 'typeorm';
import { CreateChannelDTO, UserRoomDTO } from './channel.dto';
import { Audience } from '../audiences/audience.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    private readonly audienceRepository: Repository<Audience>
  ) {}

  async findAll() {
    return this.channelRepository.find();
  }

  async findById(id: number) {
    const foundChannel = await this.channelRepository.findOne({ where: { id } });

    if (!foundChannel) throw new Error('Channel not found');

    return foundChannel;
  }

  async create(createChannelDto: CreateChannelDTO) {
    const { name, description, roomId } = createChannelDto;

    return this.channelRepository.save({
      name,
      description,
      roomId
    });
  }

  async deleteById(id: number) {
    const foundChannel = await this.findById(id);
    return this.channelRepository.remove(foundChannel);
  }

  async findAllByRoomId(roomId: number) {
    return this.channelRepository.find({
      where: { roomId }
    });
  }

  async findAllByUserId(userId: number) {
    const audiences = await this.audienceRepository.find({
      where: { userId },
      relations: { channel: true }
    });

    return audiences.map((audience) => audience.channel);
  }

  async findAllByUserIdAndRoomId(userRoomDto: UserRoomDTO) {
    const { userId, roomId } = userRoomDto;

    const channelsOfUser = await this.findAllByUserId(userId);

    return channelsOfUser.filter((channel) => channel.roomId === roomId);
  }
}
