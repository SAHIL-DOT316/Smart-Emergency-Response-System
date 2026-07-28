import { useState } from "react";

function PasswordInput({
  label,
  placeholder,
  name,
  value,
  onChange,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-3">

      <label className="form-label fw-semibold">
        {label}
      </label>

      <div className="input-group">

        <input
          type={showPassword ? "text" : "password"}
          className="form-control form-control-lg"
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
        />

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide" : "Show"}
        </button>

      </div>

    </div>
  );
}

export default PasswordInput;