/**
 * A hamburger button component for mobile view
 * @param {Object} props - The properties for the button
 * @param {React.ReactNode} props.children - The content of the button
 * @param {function} props.onClick - The function to call when the button is clicked
 * @param {string} props.className - class name for styling the button 
 * @returns {JSX.Element} The HamburgerButton component
 */


export const HamburgerButton = ({children,onClick,className="sm:hidden md:hidden "}) => {
    return (
        <button className={className} onClick={onClick}>{children}</button>
    )
}