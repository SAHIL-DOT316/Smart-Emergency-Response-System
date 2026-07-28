function TextInput({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
}) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">
        {label}
      </label>

      <input
        type={type}
        className="form-control form-control-lg"
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default TextInput;