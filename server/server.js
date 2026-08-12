import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

import app from "./app.js";
import connectDB from "./config/db.js";
import { connectToSocket } from "./socket/socketManager.js";

dotenv.config();


connectDB();


const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});



connectToSocket(io);

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );

  console.log(
    `Socket.io running on port ${PORT}`
  );
});