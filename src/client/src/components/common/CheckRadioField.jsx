
const CheckRadioField = ({
    type = "checkbox", // "checkbox" | "radio"
    label,
    name,
    value,
    checked = false,
    onChange,
    error = "",
    className = "",
}) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <input
                type={type}
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                className="form-checkbox h-4 w-4 text-blue-600"
            />
            {label && <label className="text-sm">{label}</label>}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default CheckRadioField;
