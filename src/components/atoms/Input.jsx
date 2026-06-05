import { useState, forwardRef } from "react";

const InputLogin = forwardRef(
    ({ label, type, icon, placeholder, id, ...rest }, ref) => {
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
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <img
                            src={icon}
                            alt="icons"
                            className="h-5 w-5 opacity-50 transition-opacity group-focus-within:opacity-100"
                        />
                    </div>

                    <input
                        {...rest}
                        ref={ref}
                        id={id}
                        type={inputType}
                        placeholder={placeholder}
                        className="font-[var-(--font-main)] w-full rounded-sm border border-gray-300 py-3 pr-12 pl-10 transition-all focus:ring-2 focus:border-[var-(--color-primary)]"
                    />

                    {type === "password" && (
                        <button
                            type="button"
                            onClick={togglePassword}
                            className="hover:text-primary absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors"
                        >
                            {showPassword ? (
                                <img
                                    className="w-6"
                                    src={icon}
                                    alt="closed eye password"
                                />
                            ) : (
                                <img
                                    className="w-6"
                                    src={icon}
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

InputLogin.displayName = "InputLogin";
export default InputLogin;