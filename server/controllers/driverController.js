import Driver from "../models/Driver.js";

export const updateDriverLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const driver = await Driver.findById(req.user.id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    driver.latitude = latitude;
    driver.longitude = longitude;

    await driver.save();

    res.status(200).json({
      success: true,
      message: "Driver location updated",
      driver,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({
      status: "available",
      latitude: { $ne: null },
      longitude: { $ne: null },
    }).select(
      "fullName phone ambulanceNumber latitude longitude status"
    );

    res.status(200).json({
      success: true,
      count: drivers.length,
      drivers,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};