import { User } from "./UserManger.ts";
let GLOBAL_ROOM_ID: number = 1;

interface Room {
  user1: User;
  user2: User;
}
export class RoomMAnager {
  private rooms: Map<string, Room> = new Map<string, Room>();
  createRoom(user1: User, user2: User) {
    const roomId = this.generate().toString();
    this.rooms.set(roomId, {
      user1,
      user2,
    });
    user1.socket.emit("send-offer", {
      roomId,
    });

    user2.socket.emit("send-offer", {
      roomId,
    });
  }

  onOffer(roomId: string, sdp: string, senderSocketId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    const receivingUser =
      room.user1.socket.id === senderSocketId ? room.user2 : room.user1;
    receivingUser?.socket.emit("offer", {
      sdp,
      roomId,
    });
  }

  generate() {
    return GLOBAL_ROOM_ID++;
  }
}