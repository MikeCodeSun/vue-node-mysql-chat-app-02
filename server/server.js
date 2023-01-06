const express = require("express");
const http = require("http");
const getSocketIo = require("./utils/getSocketIo");
const cors = require("cors");
const pool = require("./db/mysqlDB");
const userRoute = require("./route/userRoute");
const messageRoute = require("./route/messageRoute");
const cookieParser = require("cookie-parser");
const auth = require("./utils/auth");
require("dotenv").config();

const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
const httpServer = http.createServer(app);
const io = getSocketIo(httpServer);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (_, res) => res.send("hello world"));
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", auth, messageRoute);

httpServer.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
  pool.getConnection((err) => {
    if (err) console.log(err);
    console.log("db on");
  });
});
