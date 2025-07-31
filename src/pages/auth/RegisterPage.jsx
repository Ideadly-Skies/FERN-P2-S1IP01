import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../../configs/auth";
import Swal from "sweetalert2";

function RegisterPage() {
  const location = useLocation();
  const prefillEmail = location.state?.prefillEmail || "";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    if (password.length < 6) {
      return Swal.fire({
        text: "Password must be at least 6 characters.",
        icon: "error",
      });
    }

    if (password !== confirmPassword) {
      return Swal.fire({
        text: "Passwords do not match.",
        icon: "error",
      });
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: email,
        name: fullName,
        role: "buyers",
      });

      Swal.fire({
        text: `${user.email} successfully registered!`,
        icon: "success",
      });
      navigate("/");
    } catch (error) {
      Swal.fire({
        text: error.message,
        icon: "error",
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md border border-gray-300 p-6 rounded-md shadow-sm">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
          alt="Amazon Logo"
          className="mx-auto mb-6 h-6"
        />
        <h1 className="text-xl font-semibold mb-4">Create account</h1>

        <form onSubmit={handleRegister}>
          <label htmlFor="fullName" className="text-sm font-bold">
            Your name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full mt-1 mb-4 border border-gray-400 rounded-sm px-2 py-2 focus:outline-none focus:ring-yellow-500 focus:ring-2"
            required
          />

          <label htmlFor="email" className="text-sm font-bold">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 mb-4 border border-gray-400 rounded-sm px-2 py-2 focus:outline-none focus:ring-yellow-500 focus:ring-2"
            required
          />

          <label htmlFor="password" className="text-sm font-bold">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full mt-1 mb-1 border border-gray-400 rounded-sm px-2 py-2 focus:outline-none focus:ring-yellow-500 focus:ring-2"
            required
          />
          <p className="text-xs text-gray-600 mb-3 pl-1">
            <span className="text-blue-600">i</span> Passwords must be at least 6 characters.
          </p>

          <label htmlFor="confirmPassword" className="text-sm font-bold">
            Re-enter password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full mt-1 mb-4 border border-gray-400 rounded-sm px-2 py-2 focus:outline-none focus:ring-yellow-500 focus:ring-2"
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-b from-yellow-300 to-yellow-500 border border-yellow-700 hover:from-yellow-400 text-sm font-medium py-2 rounded-sm"
          >
            Create your Amazon account
          </button>
        </form>

        <p className="text-xs text-gray-600 mt-4">
          By creating an account, you agree to Amazon’s{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Conditions of Use
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Notice
          </a>
          .
        </p>

        <div className="mt-6 text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/auth/login")}
          >
            Sign-in
          </span>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
