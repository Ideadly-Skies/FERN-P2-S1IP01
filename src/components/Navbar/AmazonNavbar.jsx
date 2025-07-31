// src/components/Navbar.jsx
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../configs/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// signOut from account
import { signOut } from 'firebase/auth';

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user] = useAuthState(auth); // Firebase auth context
    const navigate = useNavigate();

    async function handlelogout() {
        try {
            const result = await signOut(auth);
            console.log(result);
        
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
                <span className="text-gray-300">Deliver to {user.displayName || "You"}</span>
                <span className="font-bold">Chatswood 2067</span> {/* or dynamically pull location */}
                </>
            ) : (
                <>
                <span className="text-gray-300">Delivering to Sydney 2008</span>
                <span className="font-bold">To change, sign in or enter a postcode</span>
                </>
            )}
        </div>

        {/* Search */}
        <div className="flex flex-1 mx-4">
            <select className="text-black text-sm px-2 rounded-l-md bg-gray-200 border border-r-0">
            <option value="all">All</option>
            </select>
            <input
            type="text"
            placeholder="Search Amazon.com.au"
            className="w-full px-2 py-2 bg-white text-black"
            />
            <button className="bg-[#febd69] px-4 py-2 rounded-r-md text-black">
            <FaSearch />
            </button>
        </div>

        {/* Language */}
        <div className="hidden md:flex items-center text-sm mr-4 cursor-pointer">
            <img src="https://flagcdn.com/au.svg" alt="flag" className="w-5 h-5 mr-1" />
            <span>EN</span>
            <IoMdArrowDropdown />
        </div>

        {/* Account & Lists */}
        <div
            className="relative hidden md:flex flex-col text-sm mr-4 cursor-pointer"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
        >
            <span>{user ? `Hello, ${user.displayName || ""}` : "Hello, sign in"}</span>
            <span className="font-bold flex items-center">
                Account & Lists <IoMdArrowDropdown />
            </span>

            {/* Dropdown */}
            {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-[350px] bg-white text-black rounded shadow-lg z-50 flex text-sm">
                    <div className="w-1/2 border-r px-4 py-3">
                        <h3 className="font-bold mb-2">Your Lists</h3>
                        <ul className="space-y-1">
                            <li className="px-2 py-1 hover:bg-[#f3f3f3] cursor-pointer rounded">Mechanical Keyboard</li>
                            <li className="px-2 py-1 hover:bg-[#f3f3f3] cursor-pointer rounded">Create a List</li>
                            <li className="px-2 py-1 hover:bg-[#f3f3f3] cursor-pointer rounded">Baby Wish List</li>
                        </ul>
                    </div>
                    <div className="w-1/2 px-4 py-3">
                        <h3 className="font-bold mb-2">Your Account</h3>
                        <ul className="space-y-1">
                            <li className="px-2 py-1 hover:bg-[#f3f3f3] cursor-pointer rounded">Your Account</li>
                            <li className="px-2 py-1 hover:bg-[#f3f3f3] cursor-pointer rounded">Your Orders</li>
                            <li className="px-2 py-1 hover:bg-[#f3f3f3] cursor-pointer rounded">Keep shopping for</li>
                            <li className="px-2 py-1 hover:bg-[#f3f3f3] cursor-pointer rounded">Your Recommendations</li>
                            <li className="px-2 py-1 hover:bg-[#f3f3f3] cursor-pointer rounded">Recalls and Product Safety Alerts</li>
                            <li className="px-2 py-1 hover:bg-[#f3f3f3] cursor-pointer rounded">Your Prime Membership</li>
                            <li className="px-2 py-1 hover:bg-[#f3f3f3] cursor-pointer rounded">Your Subscriptions</li>
                            <li className="px-2 py-1 hover:bg-[#f3f3f3] cursor-pointer rounded">Your Seller Account</li>
                            <li className="px-2 py-1 hover:bg-[#f3f3f3] cursor-pointer rounded">Switch Accounts</li>

                            {user ? (
                                <li 
                                    onClick={handlelogout}
                                    className="px-2 py-1 hover:bg-[#f3f3f3] cursor-pointer rounded"
                                >
                                    Sign Out
                                </li>
                            ) : (
                                <li 
                                    onClick={() => navigate("/auth/login")}
                                    className="px-2 py-1 hover:bg-[#f3f3f3] cursor-pointer rounded"
                                >
                                    Sign In
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div> 

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