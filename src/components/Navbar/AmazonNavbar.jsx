// src/components/Navbar.jsx
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

// signOut from account
import SearchBar from "./SearchBar";
import AccountDropdown from "./AccountDropdown";

export default function Navbar() {
    const { user, name } = useContext(AuthContext);
    console.log("user derived: ", user) 
    const navigate = useNavigate();

    return (
        <header className="bg-[#131921] text-white flex items-center justify-between px-4 py-2 relative">
        {/* Logo */}
        <div className="flex items-center px-2 py-1 bg-[#131921]">
            <img
            src="https://wallpapers.com/images/high/amazon-logo-black-background-xb9pdemosnjfz9ej.png"
            alt="Amazon Logo"
            className="h-8 object-contain"
            />
            <span className="text-sm ml-1 hidden md:inline text-gray-400">.com.au</span>
        </div>

        {/* Location */}
        <div
            className="hidden md:flex flex-col text-xs ml-4 leading-tight cursor-pointer"
            onClick={() => {
                if (!user){ 
                    navigate("/auth/login");
                }
            }}
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
        <SearchBar/>    

        <div className="hidden md:flex items-center text-sm mr-4 cursor-pointer">
            <img src="https://flagcdn.com/au.svg" alt="flag" className="w-5 h-5 mr-1" />
            <span>EN</span>
            <IoMdArrowDropdown />
        </div>

        {/* Account & Lists */}
        <AccountDropdown user={user} name={name} navigate={navigate}/> 

        {/* Orders */}
        <div
            className="hidden md:flex flex-col text-sm mr-4 cursor-pointer"
            onClick={() => {
                if (!user) {
                    navigate("/auth/login");
                }
            }}
        >
            <span>Returns</span>
            <span className="font-bold">& orders</span>
        </div>

        {/* Cart */}
        {user && (
            <div
                className="flex items-center text-sm font-bold cursor-pointer"
                onClick={() => navigate("/cart")}
            >
                <FaShoppingCart className="mr-1 text-2xl" />
                <span>Cart</span>
            </div>
        )}
        </header>
    );
}