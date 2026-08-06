import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/auth/PasswordInput";
import TextInput from "../../components/auth/TextInput";
import SubmitButton from "../../components/common/SubmitButton";

import { loginPatient, loginDriver,loginAdmin } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";


function Login() {
   const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
  email: "",
  password: "",
});

const [loading, setLoading] = useState(false);
const [errors, setErrors] = useState({});
const [role, setRole] = useState("patient");
const handleChange = (e) => {
  setFormData({
  ...formData,
  [e.target.name]: e.target.value,
});

setErrors({
  ...errors,
  [e.target.name]: "",
});
};
const validateForm = () => {
  const newErrors = {};

  if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Please enter a valid email.";
  }

  if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters.";
  }

 

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) {
  return;
}
 setLoading(true);
  try {
  let response;
let userData;

if (role === "patient") {
  response = await loginPatient(formData);
  userData = response.patient;
} else if (role === "driver") {
  response = await loginDriver(formData);
  userData = response.driver;
} else {
  response = await loginAdmin(formData);
  userData = response.admin;
}

login(response.token, userData);

console.log("Login Success:", response);

toast.success("Login Successful");

if (role === "patient") {
  navigate("/patient");
} else if (role === "driver") {
  navigate("/driver");
} else {
  navigate("/admin");
}
} catch (error) {
  console.log(error.response?.data);
  toast.error(error.response?.data?.message || "Login Failed");
}finally {
    setLoading(false);
  }
};
  return (
    <AuthLayout>
      <h2 className="fw-bold text-center mb-2">Welcome Back </h2>

      <p className="text-center text-muted mb-4">
        Sign in to continue
      </p>

     <form onSubmit={handleSubmit}>
<div className="mb-3">
  <label className="form-label fw-semibold">
    Login As
  </label>

  <select
    className="form-select"
    value={role}
    onChange={(e) => setRole(e.target.value)}
  >
    <option value="patient">Patient</option>
    <option value="driver">Driver</option>
    <option value="admin">Admin</option>
  </select>
</div>
       
         <TextInput
  label="Email"
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="Enter your email"
  error={errors.email}
/>

<PasswordInput
  label="Password"
  name="password"
  value={formData.password}
  onChange={handleChange}
  placeholder="Enter your password"
  error={errors.password}
/>

        

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="remember"
            />

            <label
              className="form-check-label"
              htmlFor="remember"
            >
              Remember Me
            </label>
          </div>

          <Link
            to="/forgot-password"
            className="text-decoration-none"
          >
            Forgot Password?
          </Link>

        </div>

  <SubmitButton
  loading={loading}
  text="Login"
  loadingText="Logging in..."
/>
      </form>

      <hr className="my-4" />

      <p className="text-center mb-0">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-decoration-none fw-bold"
        >
          Register
        </Link>
      </p>

    </AuthLayout>
  );
}

export default Login;