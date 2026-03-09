const FormSection = ({ title, children }) => {
  return (
    <div className="border border-gray-200 rounded-md p-3 bg-white">
      <h3 className="text-sm font-semibold text-blue-900 mb-2">{title}</h3>

      {children}
    </div>
  );
};

export default FormSection;
