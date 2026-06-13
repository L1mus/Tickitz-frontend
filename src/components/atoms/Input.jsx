import { useState, forwardRef } from "react";

/**
 * Input field component
 * @typedef {Object} InputFieldProps
 * @param {Object} props - The properties for the input
 * @param {string} props.type - The type of the input 
 * @param {string} props.label - The label of the input 
 * @param {string} props.placeholder - The placeholder of the input 
 * @param {string} props.className - class name for styling the input
 * @returns {JSX.Element} The InputField component
 */

const InputField = forwardRef(
    ({ label, type, className, placeholder, id, ...rest }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        const inputType = type === "password" && showPassword ? "text" : type;

        const togglePassword = () => {
            setShowPassword(!showPassword);
        };

        return (
            <div className="space-y-2">
                <label
                    htmlFor={id}
                    className="font-[var-(--font-main)] block text-sm font-medium"
                >
                    {label}
                </label>
                <div className="group relative">
                    <input
                        {...rest}
                        ref={ref}
                        id={id}
                        type={inputType}
                        placeholder={placeholder}
                        className={`font-[var-(--font-main)] w-full rounded-sm border border-gray-300 py-3 pr-10 pl-4 transition-all focus:ring-2 focus:border-[var-(--color-primary)] ${className}`}
                    />

                    {type === "password" && (
                        <button
                            type="button"
                            onClick={togglePassword}
                            className="hover:text-primary absolute inset-y-0 right-0 flex items-center pr-5 text-gray-400 transition-colors"
                        >
                            {showPassword ? (
                                <img
                                    className="w-4 opacity-50"
                                    src="/src/assets/icons/eye-open.svg"
                                    alt="closed eye password"
                                />
                            ) : (
                                <img
                                    className="w-4 opacity-50"
                                    src="/src/assets/icons/eye-off.svg"
                                    alt="open eye password"
                                />
                            )}
                        </button>
                    )}
                </div>
            </div>
        );
    },
);

InputField.displayName = "InputField";
export default InputField;