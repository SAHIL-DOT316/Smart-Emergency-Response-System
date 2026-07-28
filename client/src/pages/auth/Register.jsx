import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/auth/PasswordInput";
import TextInput from "../../components/auth/TextInput";

function Register() {
  const [formData, setFormData] = useState({
  fullName: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
const handleSubmit = (e) => {
  e.preventDefault();

  console.log(formData);
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

        <div className="mb-3">
          <TextInput
            label="Full Name"
            name="fullName"
            value={formData.fullName}
             onChange={handleChange} 
             placeholder="Enter your full name"
        />

        </div>

        <div className="mb-3">
          <TextInput
             label="Phone Number"
             name="phone"
          value={formData.phone}
            onChange={handleChange}
             placeholder="Enter phone number"
         />

        </div>

        <div className="mb-3">
         <TextInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
        />
        </div>

        <div className="mb-3">
           <PasswordInput
                 label="Password"
                name="password"
               value={formData.password}
              onChange={handleChange}
                placeholder="Create password"
          />
        </div>

        <div className="mb-4">
        <PasswordInput
           label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
           placeholder="Confirm password"
        />
        </div>

        <button
        type="submit"
          className="btn btn-primary btn-lg w-100"
        >
          Create Account
        </button>

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