import Select from "react-select";

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
}) => {
  const selectOptions = options.map((opt) => ({
    value: opt,
    label: opt,
  }));

  const selectedOption = selectOptions.find((opt) => opt.value === value);

  const handleChange = (selected) => {
    onChange({
      target: {
        name,
        value: selected ? selected.value : "",
      },
    });
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "34px",
      height: "34px",
      borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#2563eb",
      },
      fontSize: "13px",
    }),

    valueContainer: (base) => ({
      ...base,
      padding: "0 6px",
    }),

    input: (base) => ({
      ...base,
      margin: "0px",
      padding: "0px",
    }),

    indicatorsContainer: (base) => ({
      ...base,
      height: "34px",
    }),

    menu: (base) => ({
      ...base,
      fontSize: "13px",
    }),
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <Select
        options={selectOptions}
        value={selectedOption || null}
        onChange={handleChange}
        placeholder="Select..."
        isClearable
        styles={customStyles}
      />
    </div>
  );
};

export default SelectField;
