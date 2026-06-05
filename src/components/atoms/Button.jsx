/**
 * A button component
 * @typedef {Object} ButtonProps
 * @param {Object} props - The properties for the button
 * @param {React.ReactNode} props.children - The content of the button
 * @param {function} props.onClick - The function to call when the button is clicked
 * @param {string} props.className - class name for styling the button
 * @param {string} props.color - color of the button, can be "blue" or "white" 
 * @returns {JSX.Element} The Button component
 */


export const Button = ({children,onClick,type,className="",color=""})=>{
    const defaultClass = "rounded-md p-2 cursor-pointer"
    const colorClass = color === "blue" ? "bg-blue-600 border border-white text-white" : color === "white" ? "bg-white border border-blue-600 text-blue-600" : "";
    const finalClass =`${defaultClass} ${className} ${colorClass}`
    return (
        <button className={finalClass} type={type}  onClick={onClick}>{children}</button>
    )
}