import { useState, useRef } from 'react';
import { Button } from '../atoms/Button';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSlice } from '../../redux/slices/authSlice';
import { Modal } from './Modal';
import { NavLink, useNavigate } from 'react-router';
import toast from 'react-hot-toast';

function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, role, isLoading, currentUser } = useSelector((state) => state.auth);
  const isAdmin = role === 'admin';
  const defaultAvatar = "/images/default.jpg";
  const profileImage = currentUser?.profile_image || defaultAvatar;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const locationRef = useRef(null);

  const dummyLocations = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali'];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleLogout = () => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    setIsLogoutModalOpen(true);
  };
  const executeLogout = async () => {
    try {
      await dispatch(logoutSlice()).unwrap();
      setIsLogoutModalOpen(false);
      toast.success('Logout successful!');
      navigate('/auth');
    } catch (error) {
      setIsLogoutModalOpen(false);
      toast.error(error || "The session has ended");
      navigate('/auth');
    }
  };
  const navLinkClass = ({ isActive }) =>
    isActive ? "font-medium  text-xl text-primary text-center underline" : "text-gray-600  text-xl hover:text-primary transition-colors text-center";

  const mobileNavLinkClass = ({ isActive }) =>
    isActive ? "font-medium text-xl text-primary text-center underline" : "text-gray-600 text-xl hover:text-primary text-lg transition-colors text-center";


  return (
    <>
      <header className="sticky top-0 z-50 flex h-20 items-center justify-between bg-white px-6 md:px-20 border-b border-gray-100">
        <div className="text-4xl font-bold z-50">
          <NavLink to="/">
            <img src="/src/assets/images/Tickitz 2.png" alt="icon Tickitz" className="h-8 w-auto md:h-12.75 md:w-30" />
          </NavLink>
        </div>

        <nav className="hidden md:flex gap-12 text-small-normal">
          {isAdmin ? (
            <>
              <NavLink to="/admin/dashboard" className={navLinkClass} end>Dashboard</NavLink>
              <NavLink to="/admin/movies" className={navLinkClass}>Movie</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" className={navLinkClass} end>Home</NavLink>
              <NavLink to="/movies" className={navLinkClass}>Movie</NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4 md:gap-3 z-50">
          {isAuthenticated ? (
            <div className="flex items-center gap-3 relative">
              {!isAdmin && (
                <>
                  <div className="hidden md:flex items-center gap-1 text-medium-normal text-gray-700">
                    Location
                  </div>
                  <img
                    src="/src/assets/icons/icon_dropdown.svg"
                    alt="icon dropdown"
                    className="hidden md:block cursor-pointer hover:opacity-50 transition-opacity"
                  />
                  <img
                    src="/src/assets/icons/search.svg"
                    alt="icon search"
                    className="hidden md:block cursor-pointer hover:opacity-50"
                  />
                </>
              )}

              <img
                src={profileImage}
                alt="profile"
                onClick={toggleDropdown}
                className="h-10 w-10 hidden md:block rounded-full border border-gray-200 object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
              />

              {isDropdownOpen && (
                <div className="absolute right-0 top-12 w-40 rounded-md border border-gray-100 bg-white p-2 shadow-lg z-50">
                  {!isAdmin && (
                    <NavLink
                      to="users/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className={({ isActive }) => `w-full block rounded-md px-4 py-2 text-left text-sm transition-colors ${isActive ? 'bg-blue-50 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      My Profile
                    </NavLink>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-md px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Button onClick={() => navigate('/auth')} shape="rectangle" color="white" size="small">Sign In</Button>
              <Button onClick={() => navigate('/auth/register')} shape="rectangle" color="blue" className="h-12 w-23">Sign Up</Button>
            </div>
          )}

          <button
            onClick={toggleMenu}
            className="flex flex-col justify-center items-center md:hidden w-8 h-8 space-y-1.5 focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            <span className={`block h-0.5 w-6 bg-gray-600 transform transition duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block h-0.5 w-4 bg-gray-600 transition duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-gray-600 transform transition duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
        {/* mobile */}
        <div className={`absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-md transform transition-all duration-300 ease-in-out z-40 md:hidden ${isMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
          <nav className="flex flex-col p-6 space-y-4">
            {isAdmin ? (
              <>
                <NavLink to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className={mobileNavLinkClass} end >Dashboard</NavLink>
                <NavLink to="/admin/movies" onClick={() => setIsMenuOpen(false)} className={mobileNavLinkClass}>Movie</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/" onClick={() => setIsMenuOpen(false)} className={mobileNavLinkClass} end>Home</NavLink>
                <NavLink to="/movies" onClick={() => setIsMenuOpen(false)} className={mobileNavLinkClass}>Movie</NavLink>
              </>
            )}

            <hr className="border-gray-100 my-2" />
            {isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-2">
                {!isAdmin && (
                  <NavLink
                    to="/users/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full rounded-md py-3 text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    My Profile
                  </NavLink>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full rounded-md py-3 text-center font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Button onClick={() => { setIsMenuOpen(false); navigate('/auth'); }} shape="rectangle" color="white" size="small" className="w-full">Sign In</Button>
                <Button onClick={() => { setIsMenuOpen(false); navigate('/auth/register'); }} shape="rectangle" color="blue" className="w-full h-12">Sign Up</Button>
              </div>
            )}
          </nav>
        </div>
        <Modal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          inner="p-6 md:p-8 min-w-[300px] max-w-sm text-center bg-white "
        >
          <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Logout</h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to log out of this account?
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className="px-6 py-2 rounded-md font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Canceled
            </button>

            <button
              onClick={executeLogout}
              disabled={isLoading}
              className="px-6 py-2 rounded-md font-medium text-white bg-red-500 hover:bg-red-600 disabled:bg-red-300 transition-colors"
            >
              {isLoading ? "Exit..." : "Yes, Exit"}
            </button>
          </div>
        </Modal>
      </header>
    </>
  );
}

export default Header;