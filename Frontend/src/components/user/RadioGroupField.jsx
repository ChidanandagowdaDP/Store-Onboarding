const RadioGroupField = ({
  label,
  name,
  value,
  onChange,
  options = ["Yes", "No"],
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>

      <div className="flex gap-4">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={onChange}
              className="accent-blue-600 w-3.5 h-3.5"
            />

            {opt}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroupField;
