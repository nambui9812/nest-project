import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDTO } from './channel.dto';

@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  async getAll() {
    const channels = await this.channelService.findAll();
    return channels;
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    const foundChannel = await this.channelService.findById(id);
    return foundChannel;
  }

  @Post()
  async create(@Body() createChannelDto: CreateChannelDTO) {
    const newChannel = await this.channelService.create(createChannelDto);
    return newChannel;
  }

  @Delete(':id')
  async DeleteQueryBuilder(@Param('id') id: number) {
    await this.channelService.deleteById(id);
    return {
      message: 'Channle deleted'
    };
  }
}
