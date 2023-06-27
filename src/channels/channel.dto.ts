export interface CreateChannelDTO {
  name: string;
  description: string;
  roomId: number;
}

export interface UserRoomDTO {
  userId: number;
  roomId: number;
}
