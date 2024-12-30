import { Link } from "react-router-dom";
import { FaGripLines } from "react-icons/fa";
import { useState } from "react";
import { useSelector } from "react-redux";

const links = [
  { title: "Home", link: "/" },
  { title: "About", link: "/about" },
  { title: "All Cakes", link: "/all-cakes" },
  { title: "Cart", link: "/cart" },
  { title: "Profile", link: "/profile" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const toggleMenu = () => setIsOpen(!isOpen);

  if (isLoggedIn === false) {
    links.splice(3, 3);
  }

  return (
    <>
      <nav className="relative w-full bg-zinc-800 items-center justify-between py-3 px-8 flex text-white z-50">
        <Link to="/" className="text-2xl font-semibold flex items-center">
          <img src="public/logo.png" alt="cake" className="w-10 pr-1" />
          <h1>CakeKitchen</h1>
        </Link>
        <div className="flex items-center gap-6">
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6">
            {links.map((item, index) => (
              <Link
                to={item.link}
                key={index}
                className="hover:text-blue-500 transition-all duration-300 cursor-pointer"
              >
                {item.title}
              </Link>
            ))}
          </div>
          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex gap-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/log-in"
                  className="px-2 py-1 border hover:bg-white hover:text-zinc-800 border-blue-500 rounded"
                >
                  LogIn
                </Link>
                <Link
                  to="/sign-up"
                  className="px-2 py-1 transition-all duration-300 hover:bg-white hover:text-zinc-800 bg-blue-800 rounded"
                >
                  SignUp
                </Link>
              </>
            ) : (
              <Link
                to="/profile"
                className="px-2 py-1 transition-all duration-300 hover:bg-white hover:text-zinc-800 bg-blue-800 rounded"
              >
                Profile
              </Link>
            )}
          </div>
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="text-white text-2xl md:hidden"
          >
            <FaGripLines />
          </button>
        </div>
      </nav>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-0 left-0 bg-zinc-800 h-screen w-full z-10 mt-8 flex flex-col items-center justify-center text-white">
          {links.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              onClick={toggleMenu}
              className="hover:text-blue-500 transition-all text-2xl font-semibold mb-8 duration-300"
            >
              {item.title}
            </Link>
          ))}
          {!isLoggedIn ? (
            <>
              <Link
                to="/log-in"
                onClick={toggleMenu}
                className="px-4 mb-8 text-xl font-semibold py-2 border hover:bg-white hover:text-zinc-800 border-blue-500 rounded"
              >
                LogIn
              </Link>
              <Link
                to="/sign-up"
                onClick={toggleMenu}
                className="px-4 text-xl font-semibold transition-all duration-300 py-2 hover:bg-white hover:text-zinc-800 bg-blue-800 rounded"
              >
                SignUp
              </Link>
            </>
          ) : (
            <Link
              to="/profile"
              onClick={toggleMenu}
              className="px-4 text-xl font-semibold transition-all duration-300 py-2 hover:bg-white hover:text-zinc-800 bg-blue-800 rounded"
            >
              Profile
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
