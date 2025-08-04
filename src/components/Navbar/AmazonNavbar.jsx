import { FaShoppingCart } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

import SearchBar from "./SearchBar";
import AccountDropdown from "./AccountDropdown";
import Swal from "sweetalert2";
import { signOut } from "firebase/auth";
import { auth } from "../../../configs/auth";

export default function Navbar({ onCategoryChange, onSearchChange }) {
  const { user, name } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handlelogout() {
        try {
            await signOut(auth);
            navigate("/public");
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Logout Failed',
                text: error.message || 'An error occurred during logout.',
            });
        }
    }

  return (
    <header className="bg-[#131921] text-white px-4 py-2">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between w-full">
        {/* Logo */}
        <div
          tabIndex={0}
          className="flex items-center px-2 py-1 bg-[#131921] cursor-pointer focus:outline-none focus:ring-2 focus:ring-white hover:outline hover:outline-2 hover:outline-white rounded-sm"
          onClick={() => { user ? navigate("/") : navigate("/public"); }}
        >
          <img
            src="https://archive.org/download/amazon-2/amazon_PNG11.png"
            alt="Amazon Logo"
            className="h-8 object-contain"
          />
          <span className="text-sm ml-1 text-gray-400">.com.au</span>
        </div>

        {/* Location */}
        <div
          tabIndex={0}
          className="flex flex-col text-xs ml-4 leading-tight cursor-pointer focus:outline-none focus:ring-2 focus:ring-white hover:outline hover:outline-2 hover:outline-white rounded-sm"
          onClick={() => { if (!user) navigate("/auth/login"); }}
        >
          {user ? (
            <>
              <span className="text-gray-300">Deliver to {name || "You"}</span>
              <span className="font-bold">Chatswood 2067</span>
            </>
          ) : (
            <>
              <span className="text-gray-300">Delivering to Sydney 2008</span>
              <span className="font-bold">To change, sign in or enter a postcode</span>
            </>
          )}
        </div>

        {/* Search */}
        <SearchBar onCategoryChange={onCategoryChange} onSearchChange={onSearchChange} />

        {/* Language Dropdown */}
        <div
          tabIndex={0}
          className="flex items-center text-sm mr-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white hover:outline hover:outline-2 hover:outline-white rounded-sm"
        >
          <img src="https://flagcdn.com/au.svg" alt="flag" className="w-5 h-5 mr-1" />
          <span>EN</span>
          <IoMdArrowDropdown />
        </div>

        {/* Account & Lists */}
        <div
          tabIndex={0}
          className="focus:outline-none focus:ring-2 focus:ring-white hover:outline hover:outline-2 hover:outline-white rounded-sm"
        >
          <AccountDropdown user={user} name={name} navigate={navigate} />
        </div>

        {/* Orders */}
        <div
          tabIndex={0}
          className="flex flex-col text-sm mr-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white hover:outline hover:outline-2 hover:outline-white rounded-sm"
          onClick={() => { if (!user) navigate("/auth/login"); }}
        >
          <span>Returns</span>
          <span className="font-bold">& orders</span>
        </div>

        {/* Cart */}
        <div
          tabIndex={0}
          className="flex items-center text-sm font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-white hover:outline hover:outline-2 hover:outline-white rounded-sm"
          onClick={() => navigate("/cart")}
        >
          <FaShoppingCart className="mr-1 text-2xl" />
          <span>Cart</span>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col gap-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => { user ? navigate("/") : navigate("/public"); }}
          >
            <img
              src="https://archive.org/download/amazon-2/amazon_PNG11.png"
              alt="Amazon Logo"
              className="h-8 object-contain"
            />
          </div>

          {/* Cart */}
          <div
            className="flex items-center text-sm font-bold cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <FaShoppingCart className="mr-1 text-2xl" />
            <span>Cart</span>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar onCategoryChange={onCategoryChange} onSearchChange={onSearchChange} />

        {/* Greeting or Sign-in message */}
        <div
            tabIndex={0}
            className="text-xs text-center text-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white hover:outline hover:outline-2 hover:outline-white rounded-sm"
            onClick={() => {
                if (!user) navigate("/auth/login");
                else handlelogout();
            }}
            >
            {user ? `Hello, ${name}, click to sign out` : "Hello, sign in to gain the full experience"}
        </div>
      </div>
    </header>
  );
}
