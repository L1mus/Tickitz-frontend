import { useState } from 'react';
import { Button } from '../atoms/Button';

function Header() {
  const isLogin = false;
  const isAdmin = false;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    alert('Log out berhasil!');
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="relative flex h-20 items-center justify-between bg-white px-6 md:px-20 border-b border-gray-100">
      <div className="text-4xl font-bold z-50">
        <img src="/src/assets/images/Tickitz 2.png" alt="icon Tickitz" className="h-8 w-auto md:h-12.75 md:w-30" />
      </div>

      <nav className="hidden md:flex gap-12 text-small-normal">
        {isAdmin ? (
          <>
            <a href="#" className="font-medium text-blue-600">Dashboard</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Movie</a>
          </>
        ) : (
          <>
            <a href="#" className="font-medium text-blue-600">Home</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Movie</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Buy Ticket</a>
          </>
        )}
      </nav>

      <div className="flex items-center gap-4 md:gap-3 z-50">
        {isLogin ? (
          <div className="flex items-center gap-3 relative">
            <div className="hidden md:flex items-center gap-1 text-medium-normal text-gray-700">
              Location
            </div>
            <img 
              src="/src/assets/icons/icon_dropdown.svg" 
              alt="icon dropdown" 
              onClick={toggleDropdown}
              className="hidden md:block cursor-pointer hover:opacity-50 transition-opacity" 
            />
            <img src="/src/assets/icons/search.svg" alt="icon search" className="hidden md:block cursor-pointer" />
            
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="profile"
              className="h-10 w-10 hidden md:block rounded-full border border-gray-200"
            />

            {isDropdownOpen && (
              <div className="absolute right-0 top-12 w-40 rounded-md border border-gray-100 bg-white p-2 shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="w-full rounded-md px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <Button shape="rectangle" color="white" size="small">Sign In</Button>
            <Button shape="rectangle" color="blue" className="h-12 w-23">Sign Up</Button>
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
      <div className={`absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-md transform transition-all duration-300 ease-in-out z-40 md:hidden ${isMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
        <nav className="flex flex-col p-6 space-y-4">
          {isAdmin ? (
            <>
              <a href="#" onClick={() => setIsMenuOpen(false)} className="font-medium text-blue-600 text-lg">Dashboard</a>
              <a href="#" onClick={() => setIsMenuOpen(false)} className="text-gray-600 text-lg">Movie</a>
            </>
          ) : (
            <>
              <a href="#" onClick={() => setIsMenuOpen(false)} className="font-medium text-blue-600 text-lg">Home</a>
              <a href="#" onClick={() => setIsMenuOpen(false)} className="text-gray-600 text-lg">Movie</a>
              <a href="#" onClick={() => setIsMenuOpen(false)} className="text-gray-600 text-lg">Buy Ticket</a>
            </>
          )}
          
          <hr className="border-gray-100 my-2" />
          
          {!isLogin && (
            <div className="flex flex-col gap-3 pt-2">
              <Button shape="rectangle" color="white" size="small" className="w-full">Sign In</Button>
              <Button shape="rectangle" color="blue" className="w-full h-12">Sign Up</Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;