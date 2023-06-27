import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from '../channels/channel.entity';
import { User } from '../users/user.entity';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  text: string;

  @Column()
  userId: number;

  @Column({ nullable: true, default: null })
  replyToMessageId: number;

  @Column()
  channelId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Message)
  @JoinColumn({ name: 'replyToMessageId' })
  replyToMessage: Message;

  @OneToMany(() => Message, (message) => message.replyToMessage)
  repliedMessages: Message[];

  @ManyToOne(() => Channel, (channel) => channel.messages)
  @JoinColumn({ name: 'channelId' })
  channel: Channel;
}
