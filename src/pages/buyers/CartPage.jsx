import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart
} from "../../redux/features/cart/cartSlice";
import { formatUSD } from "../../utils/dollarFormatter";
import axios from "axios";
import Swal from "sweetalert2";
import { persistCart } from "../../redux/features/cart/cartSlice";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

import Lottie from "lottie-react";
import noDataAnimation from "../../assets/No-Data.json"

export default function CartPage() {
  const { items: cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
     
    try {
      const AUD_TO_IDR = 10597.64;

      const convertedItems = cart.map(({ id, name, price, quantity }) => ({
        id,
        name,
        price: Math.round(price * AUD_TO_IDR),
        quantity
      }));

      const convertedTotal = convertedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

      const response = await axios.post("https://fern-p2-s1ip01-server.onrender.com/create-transaction", {
        items: convertedItems,
        total: convertedTotal
      });

      const { token } = response.data;

      window.snap.pay(token, {
        onSuccess: function () {
          dispatch(clearCart());
          dispatch(persistCart({ uid: user.uid, cart: []}));

          Swal.fire({
            text: "Payment successful! Thank you.",
            icon: "success"
          });
        },
        onPending: function () {
          Swal.fire({
            text: "Waiting for payment...",
            icon: "warning"
          });
        },
        onError: function () {
          Swal.fire({
            icon: "error",
            text: "Payment failed. Please try again.",
          });
        },
        onClose: function () {
          Swal.fire({
            icon: "error",
            text: "Payment popup closed without completing.",
          });
        }
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Checkout error!",
        text: err.response?.data || err.message || err,
      }); 
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center my-10">
        <Lottie animationData={noDataAnimation} loop={true} className="w-72 h-72" />
        <p className="text-gray-600 mt-2 text-base">No recommended products found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">
      {/* Left: Items */}
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        {cart.map(item => (
          <div key={item.id} className="flex gap-4 border-b pb-4">
            <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-contain" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-sm text-gray-500">Qty:</span>
                <div className="flex items-center border rounded overflow-hidden">
                  <button
                    onClick={() => dispatch(decrementQuantity(item.id))}
                    className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 bg-white text-sm">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(incrementQuantity(item.id))}
                    className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="text-green-700 font-bold mt-2">{formatUSD(item.price)}</p>
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="text-red-500 text-sm mt-2 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Summary */}
      <div className="border p-6 rounded-md shadow bg-gray-50 h-fit">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Items ({cart.reduce((acc, item) => acc + item.quantity, 0)}):</span>
          <span>{formatUSD(total)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Order Total:</span>
          <span>{formatUSD(total)}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded font-semibold"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
