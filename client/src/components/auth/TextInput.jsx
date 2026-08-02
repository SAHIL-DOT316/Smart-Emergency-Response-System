function TextInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <>
      <label className="form-label fw-semibold">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-control ${
          error ? "is-invalid" : ""
        }`}
      />

      {error && (
        <div className="invalid-feedback">
          {error}
        </div>
      )}
    </>
  );
}

export default TextInput;