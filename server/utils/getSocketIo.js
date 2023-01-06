const { Server } = require("socket.io");
const pool = require("../db/mysqlDB").promise();

module.exports = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log("user is connect");
    let room;
    socket.on("join", (data) => {
      // console.log(data);
      // console.log(socket.rooms);

      [...socket.rooms]
        .filter((room) => room !== data)
        .forEach((id) => socket.leave(id));
      room = data;
      socket.join(data);
    });
    socket.on("message", async (data) => {
      const [rows, _] = await pool.query(
        "INSERT INTO message(content, from_user, to_user) VALUES(?,?,?)",
        [data.content, data.from_user, data.to_user]
      );

      io.to(room).emit("message", { id: rows.insertId, ...data });
    });
    socket.on("disconnect", () => {
      console.log("user out of connection");
    });
  });

  return io;
};
