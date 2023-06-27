import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';

export enum ROLE {
  owner = 'OWNER',
  admin = 'ADMIN',
  user = 'USER'
}

@Entity({ name: 'members' })
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: ROLE;

  @Column()
  userId: number;

  @Column()
  roomId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => Room)
  @JoinColumn({ name: 'roomId' })
  room: Room;
}
