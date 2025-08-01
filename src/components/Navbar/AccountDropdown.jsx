import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { signOut } from 'firebase/auth';
import { auth } from "../../../configs/auth";
import Swal from "sweetalert2";

export default function AccountDropdown({ user, name, navigate }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

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
    <div className="relative hidden md:flex flex-col text-sm mr-4 cursor-pointer">
      <div onClick={toggleDropdown}>
        <span>{user ? `Hello, ${name || ""}` : "Hello, sign in"}</span>
        <span className="font-bold flex items-center">
          Account & Lists <IoMdArrowDropdown />
        </span>
      </div>

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
                <li onClick={handlelogout} className="px-2 py-1 hover:bg-[#f3f3f3] cursor-pointer rounded">
                  Sign Out
                </li>
              ) : (
                <li onClick={() => navigate("/auth/login")} className="px-2 py-1 hover:bg-[#f3f3f3] cursor-pointer rounded">
                  Sign In
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
