import React, { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { auth } from "../../../configs/auth";
import { db } from "../../../configs/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    async function handleEmailSubmit(e) {
        e.preventDefault();

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail) {
            return Swal.fire({
                text: "Please enter a valid email or phone number.",
                icon: "error",
            });
        }

        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", normalizedEmail));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                Swal.fire({
                    text: "This email is not registered. Redirecting to registration page...",
                    icon: "info",
                    timer: 2000,
                    showConfirmButton: false,
                });
                setTimeout(() => {
                    navigate("/auth/register", { state: { prefillEmail: normalizedEmail } });
                }, 2000);
            } else {
                setEmail(normalizedEmail);
                setStep(2);
            }
        } 
        catch (err) {
          Swal.fire({
            title: "Error checking email!",
            text: err,
            icon: "error",
          });
        }
    }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      Swal.fire({
        text: `${user.user.email} successfully logged in!`,
        icon: "success",
      });
      navigate("/");
    } catch (err) {
      Swal.fire({ text: err.message, icon: "error" });
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

        {/* Step 1: Email input */}
        {step === 1 && (
          <>
            <h1 className="text-xl font-medium mb-4">Sign in or create account</h1>
            <form onSubmit={handleEmailSubmit}>
              <label htmlFor="email" className="text-sm font-bold">
                Enter mobile number or email
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 mb-4 border border-gray-400 rounded-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-sm font-medium py-2 rounded-sm"
              >
                Continue
              </button>
            </form>
          </>
        )}

        {/* Step 2: Password input */}
        {step === 2 && (
          <>
            <h1 className="text-xl font-medium mb-2">Sign in</h1>
            <div className="text-sm text-gray-700 mb-2">
              {email}{" "}
              <button
                className="text-blue-600 hover:underline ml-1"
                onClick={() => setStep(1)}
              >
                Change
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-bold">
                  Password
                </label>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 mb-4 border border-gray-400 rounded-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-sm font-medium py-2 rounded-sm"
              >
                Sign-In
              </button>
            </form>
          </>
        )}

        <p className="text-xs text-gray-600 mt-4">
          By continuing, you agree to Amazon's{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Conditions of Use
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Notice
          </a>
          .
        </p>

        <div className="mt-4 text-sm">
          <a href="#" className="text-blue-600 hover:underline">
            Need help?
          </a>
        </div>

        <hr className="my-4" />

        <div className="text-sm">
          <span className="font-bold">Buying for work?</span>
          <br />
          <a href="#" className="text-blue-600 hover:underline">
            Create a free business account
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
