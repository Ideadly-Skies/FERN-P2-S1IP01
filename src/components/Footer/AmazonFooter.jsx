import React from "react";

function AmazonFooter() {
  return (
    <footer className="bg-[#232F3E] text-white text-sm pt-10 w-full">
      <div className="text-center mb-6">
        <a href="#" className="text-white hover:underline">
          Back to top
        </a>
      </div>

      {/* Outer full-width container */}
      <div className="w-full px-4">
        {/* Inner centered content */}
        <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 text-[#ddd]">
          <div>
            <h3 className="font-bold text-white mb-2">Get to Know Us</h3>
            <ul className="space-y-1">
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">About Amazon</a></li>
              <li><a href="#">Investor Relations</a></li>
              <li><a href="#">Amazon Devices</a></li>
              <li><a href="#">Amazon Science</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-2">Make Money with Us</h3>
            <ul className="space-y-1">
              <li><a href="#">Sell products on Amazon</a></li>
              <li><a href="#">Sell on Amazon Business</a></li>
              <li><a href="#">Sell apps on Amazon</a></li>
              <li><a href="#">Become an Affiliate</a></li>
              <li><a href="#">Advertise Your Products</a></li>
              <li><a href="#">Self-Publish with Us</a></li>
              <li><a href="#">Host an Amazon Hub</a></li>
              <li><a href="#">› See More Make Money with Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-2">Amazon Payment Products</h3>
            <ul className="space-y-1">
              <li><a href="#">Amazon Business Card</a></li>
              <li><a href="#">Shop with Points</a></li>
              <li><a href="#">Reload Your Balance</a></li>
              <li><a href="#">Amazon Currency Converter</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-2">Let Us Help You</h3>
            <ul className="space-y-1">
              <li><a href="#">Amazon and COVID-19</a></li>
              <li><a href="#">Your Account</a></li>
              <li><a href="#">Your Orders</a></li>
              <li><a href="#">Shipping Rates & Policies</a></li>
              <li><a href="#">Returns & Replacements</a></li>
              <li><a href="#">Manage Your Content and Devices</a></li>
              <li><a href="#">Help</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-600 py-4 text-center text-gray-400 text-xs">
        <p>
          <span className="text-white font-semibold">Amazon</span> | English | USD - U.S. Dollar | United States
        </p>
      </div>
    </footer>
  );
}

export default AmazonFooter;
