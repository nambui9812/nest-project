import { Member } from '../members/member.entity';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';
import { Channel } from '../channels/channel.entity';
import { Message } from '../messages/message.entity';
import { Audience } from '../audiences/audience.entity';

const entities = [User, Room, Member, Channel, Message, Audience];

export default entities;
