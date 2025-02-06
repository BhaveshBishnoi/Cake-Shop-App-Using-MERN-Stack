import { Link, useNavigate } from "react-router-dom";
import { FaGripLines, FaUser } from "react-icons/fa";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userRole = useSelector((state) => state.auth.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

  const handleLogout = () => {
    dispatch(authActions.logout());
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    navigate('/');
  };

  // Define navigation links based on auth state and role
  const getNavigationLinks = () => {
    const links = [
      { title: "Home", link: "/" },
      { title: "About", link: "/about" },
      { title: "All Cakes", link: "/all-cakes" },
    ];

    if (isLoggedIn) {
      links.push({ title: "Cart", link: "/cart" });
      if (userRole === 'admin') {
        links.push({ title: "Dashboard", link: "/dashboard" });
      }
    }

    return links;
  };

  return (
    <nav className="relative w-full bg-zinc-800 items-center justify-between py-3 px-8 flex text-white z-50">
      <Link to="/" className="text-2xl font-semibold flex items-center">
        <img src="/logo.png" alt="cake" className="w-10 pr-1" />
        <h1>CakeKitchen</h1>
      </Link>

      <div className="flex items-center gap-6">
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          {getNavigationLinks().map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className="hover:text-pink-500 transition-all duration-300 cursor-pointer"
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* Auth Buttons or Profile Menu */}
        <div className="hidden md:flex gap-4 items-center">
          {!isLoggedIn ? (
            <>
              <Link
                to="/log-in"
                className="px-4 py-2 border hover:bg-pink-600 hover:border-pink-600 border-white rounded"
              >
                Login
              </Link>
              <Link
                to="/sign-up"
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-700 rounded"
              >
                <FaUser />
                Profile
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-md shadow-lg py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-zinc-700"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 hover:bg-zinc-700"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-zinc-700 text-pink-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden text-2xl">
          <FaGripLines />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-zinc-800 py-4 px-8">
          {getNavigationLinks().map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className="block py-2 hover:text-pink-500"
            >
              {item.title}
            </Link>
          ))}
          {!isLoggedIn ? (
            <div className="flex flex-col gap-2 mt-4">
              <Link
                to="/log-in"
                className="px-4 py-2 border hover:bg-pink-600 hover:border-pink-600 border-white rounded text-center"
              >
                Login
              </Link>
              <Link
                to="/sign-up"
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded text-center"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="mt-4">
              <Link
                to="/profile"
                className="block py-2 hover:text-pink-500"
              >
                My Profile
              </Link>
              <Link
                to="/orders"
                className="block py-2 hover:text-pink-500"
              >
                My Orders
              </Link>
              <button
                onClick={handleLogout}
                className="block py-2 text-pink-500 hover:text-pink-400"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
