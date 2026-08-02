import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/auth/PasswordInput";
import TextInput from "../../components/auth/TextInput";
import SubmitButton from "../../components/common/SubmitButton";

import { registerPatient } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";//for alert message

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  fullName: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
});
const [loading, setLoading] = useState(false);
const [errors, setErrors] = useState({});
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

  if (!formData.fullName.trim()) {
    newErrors.fullName = "Full name is required.";
  }

  if (!/^[0-9]{10}$/.test(formData.phone)) {
    newErrors.phone = "Phone number must be 10 digits.";
  }

  if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Please enter a valid email.";
  }

  if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters.";
  }

  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match.";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
const handleSubmit = async (e) => {
  e.preventDefault();
   if (!validateForm()) {
  return;
}
  if (formData.password !== formData.confirmPassword) {
   toast.error("Passwords do not match");
    return;
  }
setLoading(true);
  try {
    const response = await registerPatient({
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
    });

    toast.success(response.message);

    navigate("/login");
  } catch (error) {
    toast.error(error.response?.data?.message || "Registration Failed");
  }finally {
    setLoading(false);
  }
};
  return (
    <AuthLayout>

      <h2 className="fw-bold text-center mb-2">
        Create Patient Account
      </h2>

      <p className="text-center text-muted mb-4">
        Register to request emergency services.
      </p>

      <form onSubmit={handleSubmit}>

        
         <TextInput
  label="Full Name"
  name="fullName"
  value={formData.fullName}
  onChange={handleChange}
  placeholder="Enter your full name"
  error={errors.fullName}
/>
        

        
        <TextInput
  label="Phone Number"
  name="phone"
  value={formData.phone}
  onChange={handleChange}
  placeholder="Enter phone number"
  error={errors.phone}
/>
        

       
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
  placeholder="Create password"
  error={errors.password}
/>

        
      <PasswordInput
  label="Confirm Password"
  name="confirmPassword"
  value={formData.confirmPassword}
  onChange={handleChange}
  placeholder="Confirm password"
  error={errors.confirmPassword}
/>
    <SubmitButton
  loading={loading}
  text="Create Account"
  loadingText="Creating Account..."
/>

      </form>

      <hr className="my-4" />

      <p className="text-center mb-0">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-decoration-none fw-bold"
        >
          Login
        </Link>
      </p>

    </AuthLayout>
  );
}

export default Register;