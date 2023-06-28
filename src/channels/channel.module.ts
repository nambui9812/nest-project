import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { Channel } from './channel.entity';
import { Audience } from '../audiences/audience.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, Audience])],
  controllers: [ChannelController],
  providers: [ChannelService]
})
export class ChannelModule {}
