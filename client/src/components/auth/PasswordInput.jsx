import { useState } from "react";

function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <label className="form-label fw-semibold">
        {label}
      </label>

      <div className="input-group">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`form-control ${
            error ? "is-invalid" : ""
          }`}
        />

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() =>
            setShowPassword(!showPassword)
          }
        >
          <i
            className={`bi ${
              showPassword
                ? "bi-eye-slash"
                : "bi-eye"
            }`}
          ></i>
        </button>

        {error && (
          <div className="invalid-feedback d-block">
            {error}
          </div>
        )}
      </div>
    </>
  );
}

export default PasswordInput;