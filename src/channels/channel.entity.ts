import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from '../messages/message.entity';
import { Room } from '../rooms/room.entity';

@Entity({ name: 'channels' })
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  roomId: number;

  @ManyToOne(() => Room, (room) => room.channels)
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @OneToMany(() => Message, (message) => message.channel)
  messages: Message[];
}
