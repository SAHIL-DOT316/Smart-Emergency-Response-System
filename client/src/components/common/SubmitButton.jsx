function SubmitButton({
  loading,
  text,
  loadingText,
  className = "btn btn-primary btn-lg w-100",
}) {
  return (
    <button
      type="submit"
      className={className}
      disabled={loading}
    >
      {loading ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          {loadingText}
        </>
      ) : (
        text
      )}
    </button>
  );
}

export default SubmitButton;