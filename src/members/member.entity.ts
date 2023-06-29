import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';

export enum ROLE {
  owner = 'OWNER',
  mod = 'MODERATOR',
  user = 'USER'
}

export enum STATUS {
  active = 'ACTIVE',
  banned = 'BANNED'
}

@Entity({ name: 'members' })
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: ROLE;

  @Column()
  status: STATUS;

  @Column()
  userId: number;

  @Column()
  roomId: number;

  @ManyToOne(() => User, (user) => user.members)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Room, (room) => room.members)
  @JoinColumn({ name: 'roomId' })
  room: Room;
}
