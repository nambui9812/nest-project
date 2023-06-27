import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Channel } from '../channels/channel.entity';

export enum Permission {
  read = 'READ',
  readAndWrite = 'READ_AND_WRITE'
}

@Entity({ name: 'audiences' })
export class Audience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  permission: Permission;

  @Column()
  userId: number;

  @Column()
  channelId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => Channel)
  @JoinColumn({ name: 'channelId' })
  channel: Channel;
}
