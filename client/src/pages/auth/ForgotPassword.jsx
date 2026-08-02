import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import TextInput from "../../components/auth/TextInput";
import SubmitButton from "../../components/common/SubmitButton";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const handleSubmit = (e) => {
  e.preventDefault();

  if (!email.trim()) {
    alert("Please enter your email.");
    return;
  }

  console.log(email);
};
  return (
    <AuthLayout>

      <h2 className="fw-bold text-center mb-2">
        Forgot Password
      </h2>

      <p className="text-center text-muted mb-4">
        Enter your email to receive a password reset link.
      </p>

      <form onSubmit={handleSubmit}>

        
          <TextInput
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
/>
        
        <button
        type="submit"
          className="btn btn-primary btn-lg w-100"
        >
          Send Reset Link
        </button>

      </form>

      <hr className="my-4" />

      <p className="text-center mb-0">
        Back to{" "}
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

export default ForgotPassword;