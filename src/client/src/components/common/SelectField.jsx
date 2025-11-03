const SelectField = ({
    label,
    name,
    value,
    options = [],
    onChange,
    onBlur,
    disabled = false,
    required = false,
    placeholder = "--Chọn--",
    error = "",
    className = "",
}) => {
    const baseClass = disabled
        ? "w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed transition-colors duration-200"
        : "w-full border rounded-md px-3 py-2 bg-white text-black border-gray-300 hover:border-gray-400 transition-colors duration-200";

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium mb-1" htmlFor={name}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                className={baseClass}
            >
                <option value="">{placeholder}</option>
                {options.map(opt => (
                    <option key={opt.id} value={opt.id}>
                        {opt.name}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default SelectField;