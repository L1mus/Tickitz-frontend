/**
 * A social media button component
 * @typedef {Object} SocialButtonProps
 * @param {Object} props - The properties for the button
 * @param {React.ReactNode} props.children - The content of the button
 * @param {function} props.onClick - The function to call when the button is clicked
 * @param {string} props.className - class name for styling the button
 * @returns {JSX.Element} The SocialButton component
 */

export const SocialButton = ({children,onClick,className=""})=>{
    const defaultClass = "text-gray-500 rounded-full border bg-white p-2"
    const finalClass =`${defaultClass} ${className}`
    return (
        <button className={finalClass} onClick={onClick}>{children}</button>
    )
}
