export interface CreateRoomDTO {
  name: string;
  description: string;
}

export interface UserRoomDTO {
  userId: number;
  roomId: number;
}
