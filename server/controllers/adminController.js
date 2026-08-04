import Driver from "../models/Driver.js";
import Hospital from "../models/Hospital.js";

import bcrypt from "bcryptjs";


export const addDriver = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      password,
      ambulanceNumber,
      licenseNumber,
    } = req.body;

    // Check required fields
    if (
      !fullName ||
      !phone ||
      !email ||
      !password ||
      !ambulanceNumber ||
      !licenseNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check email
    const existingDriver = await Driver.findOne({ email });

    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: "Driver already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create driver
    const driver = await Driver.create({
      fullName,
      phone,
      email,
      password: hashedPassword,
      ambulanceNumber,
      licenseNumber,
    });

    const driverData = driver.toObject();
    delete driverData.password;

    res.status(201).json({
      success: true,
      message: "Driver added successfully",
      driver: driverData,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select("-password");

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
export const getDriverById = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findById(id).select("-password");

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    res.status(200).json({
      success: true,
      driver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      fullName,
      phone,
      email,
      ambulanceNumber,
      licenseNumber,
      status,
    } = req.body;

    const driver = await Driver.findById(id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    driver.fullName = fullName || driver.fullName;
    driver.phone = phone || driver.phone;
    driver.email = email || driver.email;
    driver.ambulanceNumber =
      ambulanceNumber || driver.ambulanceNumber;
    driver.licenseNumber =
      licenseNumber || driver.licenseNumber;
    driver.status = status || driver.status;

    await driver.save();

    const driverData = driver.toObject();
    delete driverData.password;

    res.status(200).json({
      success: true,
      message: "Driver updated successfully",
      driver: driverData,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findById(id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    await Driver.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Driver deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const addHospital = async (req, res) => {
  try {
    const {
      hospitalName,
      email,
      phone,
      password,
      address,
      city,
      emergencyBeds,
      availableBeds,
    } = req.body;

    if (
      !hospitalName ||
      !email ||
      !phone ||
      !password ||
      !address ||
      !city
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const existingHospital = await Hospital.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingHospital) {
      return res.status(400).json({
        success: false,
        message: "Hospital already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const hospital = await Hospital.create({
      hospitalName,
      email,
      phone,
      password: hashedPassword,
      address,
      city,
      emergencyBeds,
      availableBeds,
    });

    const hospitalData = hospital.toObject();
    delete hospitalData.password;

    res.status(201).json({
      success: true,
      message: "Hospital added successfully",
      hospital: hospitalData,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().select("-password");

    res.status(200).json({
      success: true,
      count: hospitals.length,
      hospitals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getHospitalById = async (req, res) => {
  try {
    const { id } = req.params;

    const hospital = await Hospital.findById(id).select("-password");

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    res.status(200).json({
      success: true,
      hospital,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateHospital = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      hospitalName,
      phone,
      email,
      address,
      city,
      emergencyBeds,
      availableBeds,
    } = req.body;

    const hospital = await Hospital.findById(id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    hospital.hospitalName = hospitalName || hospital.hospitalName;
    hospital.phone = phone || hospital.phone;
    hospital.email = email || hospital.email;
    hospital.address = address || hospital.address;
    hospital.city = city || hospital.city;
    hospital.emergencyBeds =
      emergencyBeds ?? hospital.emergencyBeds;
    hospital.availableBeds =
      availableBeds ?? hospital.availableBeds;

    await hospital.save();

    const hospitalData = hospital.toObject();
    delete hospitalData.password;

    res.status(200).json({
      success: true,
      message: "Hospital updated successfully",
      hospital: hospitalData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteHospital = async (req, res) => {
  try {
    const { id } = req.params;

    const hospital = await Hospital.findById(id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    await Hospital.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Hospital deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};