function Input({ className = "", label, required, ...rest }) {
  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={rest.name} className="input-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        {...rest}
        id={rest.name}
        className={className}
        required={required}
        autoComplete="off"
      />
    </div>
  );
}

export default Input;
