const connectedDrivers = new Map();

// Store latest location of every driver
const driverLocations = new Map();

export const connectToSocket = (io) => {

  io.on("connection", (socket) => {

    console.log("Socket connected:", socket.id);


    // =========================================
    // DRIVER ONLINE
    // =========================================

    socket.on("driver-online", (driverId) => {

      if (!driverId) {
        return;
      }

      connectedDrivers.set(
        driverId.toString(),
        socket.id
      );

      console.log(
        `Driver ${driverId} is online`
      );

      console.log(
        `Socket ID: ${socket.id}`
      );

    });


    // =========================================
    // DRIVER LOCATION UPDATE
    // =========================================

    socket.on(
      "driver-location-update",
      (data) => {
            console.log(
      "DRIVER LOCATION UPDATE:",
      data
    );

        try {

          const {
            driverId,
            latitude,
            longitude,
          } = data;

          if (
            !driverId ||
            latitude === undefined ||
            longitude === undefined
          ) {
            return;
          }


          // Store latest driver location

          driverLocations.set(
            driverId.toString(),
            {
              latitude,
              longitude,
              updatedAt: new Date(),
            }
          );


          console.log(
            `Driver ${driverId} location:`,
            latitude,
            longitude
          );


          // =====================================
          // SEND LOCATION TO PATIENT
          // =====================================

          io.emit(
            "driver-location-update",
            {
              driverId,
              latitude,
              longitude,
              updatedAt: new Date(),
            }
          );

        } catch (error) {

          console.error(
            "Driver location socket error:",
            error
          );

        }

      }
    );


    // =========================================
    // DRIVER DISCONNECT
    // =========================================

    socket.on("disconnect", () => {

      for (
        const [driverId, socketId]
        of connectedDrivers.entries()
      ) {

        if (socketId === socket.id) {

          connectedDrivers.delete(
            driverId
          );

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
    `Emergency sent to driver ${driverId}`
  );

  return true;

};


// =========================================
// GET DRIVER LOCATION
// =========================================

export const getDriverLocation = (
  driverId
) => {

  return driverLocations.get(
    driverId.toString()
  );

};