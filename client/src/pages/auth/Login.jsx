import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/auth/PasswordInput";
import TextInput from "../../components/auth/TextInput";

function Login() {
  const [formData, setFormData] = useState({
  email: "",
  password: "",
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
      <h2 className="fw-bold text-center mb-2">Welcome Back </h2>

      <p className="text-center text-muted mb-4">
        Sign in to continue
      </p>

     <form onSubmit={handleSubmit}>

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
           placeholder="Enter your password"
/>
        </div>

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

       <button
  type="submit"
  className="btn btn-primary btn-lg w-100"
>
  Login
</button>

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