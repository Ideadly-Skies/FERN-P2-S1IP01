import React, { createContext, useContext, useReducer, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../configs/auth";
import { AuthContext } from "../contexts/AuthContext";

const CartContext = createContext();

export const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.find(item => item.id === action.payload.id);
      if (exists) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...state, { ...action.payload, quantity: 1 }];
      }
    }

    case "INCREMENT":
      return state.map(item =>
        item.id === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

    case "DECREMENT":
      return state.map(item =>
        item.id === action.payload && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );

    case "REMOVE_ITEM":
      return state.filter(item => item.id !== action.payload);

    case "CLEAR_CART":
      return [];

    case "SET_CART":
      return action.payload;

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    if (user?.uid) {
      const fetchCart = async () => {
        const cartRef = doc(db, "users", user.uid);
        const snap = await getDoc(cartRef);
        if (snap.exists() && snap.data().cart) {
          const savedCart = snap.data().cart;
          dispatch({ type: "SET_CART", payload: savedCart });
        }
      };
      fetchCart();
    }
  }, [user?.uid]);

  useEffect(() => {
    const saveCart = async () => {
      if (!user?.uid || cart.length === 0) return;
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { cart }, { merge: true });
    };
    saveCart();
  }, [cart, user?.uid]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);