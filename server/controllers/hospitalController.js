import Hospital from "../models/Hospital.js";


// =========================================
// UPDATE HOSPITAL LOCATION
// =========================================

export const updateHospitalLocation = async (
  req,
  res
) => {
  try {

    const hospitalId = req.user.id;

    const {
      latitude,
      longitude,
    } = req.body;

    // =====================================
    // VALIDATION
    // =====================================

    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Latitude and longitude are required",
      });
    }

    // =====================================
    // VALIDATE RANGE
    // =====================================

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates",
      });
    }

    // =====================================
    // FIND HOSPITAL
    // =====================================

    const hospital =
      await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    // =====================================
    // UPDATE LOCATION
    // =====================================

    hospital.latitude = latitude;
    hospital.longitude = longitude;
    hospital.locationSet = true;

    await hospital.save();

    // =====================================
    // RESPONSE
    // =====================================

    return res.status(200).json({
      success: true,
      message:
        "Hospital location updated successfully",

      hospital: {
        _id: hospital._id,
        hospitalName:
          hospital.hospitalName,
        latitude:
          hospital.latitude,
        longitude:
          hospital.longitude,
        locationSet:
          hospital.locationSet,
      },
    });

  } catch (error) {

    console.error(
      "Update hospital location error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE HOSPITAL BED AVAILABILITY


export const updateHospitalBeds = async (req, res) => {
  try {
    const hospitalId = req.user.id;

    const { availableBeds } = req.body;

    // Validate
    if (
      availableBeds === undefined ||
      availableBeds === null ||
      availableBeds < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid available bed count",
      });
    }

    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    // Available beds cannot exceed total emergency beds
    if (availableBeds > hospital.emergencyBeds) {
      return res.status(400).json({
        success: false,
        message:
          "Available beds cannot be greater than emergency beds",
      });
    }

    hospital.availableBeds = availableBeds;

    await hospital.save();

    const hospitalData = hospital.toObject();

    delete hospitalData.password;

    res.status(200).json({
      success: true,
      message: "Bed availability updated successfully",
      hospital: hospitalData,
    });

  } catch (error) {

    console.error(
      "Update hospital beds error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};