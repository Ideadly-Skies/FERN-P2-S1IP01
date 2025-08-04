// src/utils/cartFirestore.js
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../configs/auth";

export const fetchUserCart = async (uid) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().cart || [] : [];
};

export const saveUserCart = async (uid, cart) => {
  const ref = doc(db, "users", uid);
  await setDoc(ref, { cart }, { merge: true });
};