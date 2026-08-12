const connectedDrivers = new Map();

export const connectToSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("driver-online", (driverId) => {
      if (!driverId) {
        return;
      }

      connectedDrivers.set(
        driverId.toString(),
        socket.id
      );

      console.log(
        ` Driver ${driverId} is online`
      );

      console.log(
        `Socket ID: ${socket.id}`
      );
    });

    // =========================================
    // DRIVER DISCONNECT
    // =========================================

    socket.on("disconnect", () => {
      for (
        const [driverId, socketId]
        of connectedDrivers.entries()
      ) {
        if (socketId === socket.id) {
          connectedDrivers.delete(driverId);

          console.log(
            `Driver ${driverId} disconnected`
          );

          break;
        }
      }
    });
  });
};

// =========================================
// SEND EMERGENCY TO DRIVER
// =========================================

export const sendEmergencyToDriver = (
  io,
  driverId,
  emergency
) => {

  const socketId =
    connectedDrivers.get(
      driverId.toString()
    );

  if (!socketId) {

    console.log(
      `Driver ${driverId} is offline`
    );

    return false;
  }

  io.to(socketId).emit(
    "new-emergency-request",
    emergency
  );

  console.log(
    ` Emergency sent to driver ${driverId}`
  );

  return true;
};