import { io } from "socket.io-client";

// 1125 io client connect
const socketIoUrl = "http://localhost:4000";
class SocketIoService {
  socket;

  constructor() {}
  connectSocketIo() {
    this.socket = io(socketIoUrl);
  }
  sendMessage(message) {
    this.socket.emit("message", message);
  }
  joinRoom(room) {
    this.socket.emit("join", room);
  }
  // 0105 only user get message, to not get, solution server emit neet use io not socket
  getMessage(cb) {
    this.socket.on("message", (data) => {
      // console.log(data);
      cb(data);
    });
  }
}

export default new SocketIoService();
