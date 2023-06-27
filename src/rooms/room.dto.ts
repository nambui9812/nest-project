export interface CreateRoomDTO {
  userId: number;
  name: string;
}

export interface UserRoomDTO {
  userId: number;
  roomId: number;
}
