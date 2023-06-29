import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from '../channels/channel.entity';
import { Member } from '../members/member.entity';

@Entity({ name: 'rooms' })
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  url: string;

  @OneToMany(() => Member, (member) => member.room)
  members: Member[];

  @OneToMany(() => Channel, (channel) => channel.room)
  channels: Channel[];
}
