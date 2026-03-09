const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  readOnly = false,
}) => {
  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-[11px] font-medium text-gray-600">{label}</label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
        className="border border-gray-300
        rounded
        px-2 py-1
        text-xs
        h-7
        outline-none
        bg-white
        focus:border-blue-600
        focus:ring-1
        focus:ring-blue-500
        transition
        disabled:bg-gray-100
        read-only:bg-gray-100"
      />
    </div>
  );
};

export default InputField;
