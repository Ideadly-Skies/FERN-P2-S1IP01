import React from "react";
import { useCart } from "../../contexts/CartContext";
import { formatUSD } from "../../utils/dollarFormatter";
import axios from "axios";

export default function CartPage() {
  const { cart, dispatch } = useCart();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    console.log("Cart payload:", cart);
    console.log("Total:", total);

    try {
      // hardcoded approach
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
          dispatch({ type: "CLEAR_CART" });
          alert("Payment successful! Thank you.");
        },
        onPending: function () {
          console.log("Waiting for payment...");
        },
        onError: function () {
          alert("Payment failed. Please try again.");
        },
        onClose: function () {
          console.log("Payment popup closed without completing.");
        }
      });
    } catch (err) {
      console.error("Checkout error:", err.response?.data || err.message || err);
      alert("Unable to process payment.");
    }
  };

  if (cart.length === 0)
    return <div className="text-center p-10">Your cart is empty.</div>;

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
                    onClick={() => dispatch({ type: "DECREMENT", payload: item.id })}
                    className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 bg-white text-sm">{item.quantity}</span>
                  <button
                    onClick={() => dispatch({ type: "INCREMENT", payload: item.id })}
                    className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="text-green-700 font-bold mt-2">{formatUSD(item.price)}</p>
              <button
                onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
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
