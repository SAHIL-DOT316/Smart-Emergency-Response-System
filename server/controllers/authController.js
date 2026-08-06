import Patient from "../models/Patient.js";
import Admin from "../models/Admin.js";
import Driver from "../models/Driver.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const registerPatient = async (req, res) => {
  try {
    const { fullName, phone, email, password } = req.body;

    // Validation
    if (!fullName || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check if email already exists
    const existingEmail = await Patient.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Check if phone already exists
    const existingPhone = await Patient.findOne({ phone });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",
      });
    }
    // Hash Password
const hashedPassword = await bcrypt.hash(password, 10);
    // Create patient
    const patient = await Patient.create({
      fullName,
      phone,
      email,
      password: hashedPassword,
    });

    const patientData = patient.toObject();
delete patientData.password;

res.status(201).json({
  success: true,
  message: "Patient registered successfully",
  patient: patientData,
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    // Find patient
    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }
    // Compare password
const isMatch = await bcrypt.compare(password, patient.password);

if (!isMatch) {
  return res.status(401).json({
    success: false,
    message: "Invalid email or password",
  });
}
const token = jwt.sign(
  {
    id: patient._id,
    role: patient.role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);
  const patientData = patient.toObject();
delete patientData.password;

res.status(200).json({
  success: true,
  message: "Login successful",
  token,
  patient: patientData,
});

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const adminData = admin.toObject();
    delete adminData.password;

    res.status(200).json({
      success: true,
      message: "Admin Login Successful",
      token,
      admin: adminData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Driver login 

export const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const driver = await Driver.findOne({ email });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      driver.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: driver._id,
        role: driver.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const driverData = driver.toObject();
    delete driverData.password;

    res.status(200).json({
      success: true,
      message: "Driver login successful",
      token,
      driver: driverData,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};