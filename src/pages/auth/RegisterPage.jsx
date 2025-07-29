import { React, useState } from 'react'
import { useNavigate } from 'react-router'

// to persist changes in db
import { auth } from '../../../configs/auth'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import Swal from 'sweetalert2'
import { setDoc, doc } from 'firebase/firestore'
import { db } from '../../../configs/auth'

function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    async function handleRegister (e) {
        e.preventDefault()
        // console.log("submitted value: ", {email, password})
        
        try {
            // display successfully registered value with swal
            const registeredUser = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', registeredUser.user.uid), {
                email: email,
                name: fullName,
                role: 'consumer',
            })
            Swal.fire({
                text: `${registeredUser.user.email} successfully registered`,
                icon: "success"
            });
            navigate("/")  

        } catch (error){
            // display error with swal
            Swal.fire({
                text: error,
            });
        }
    }

    return (
        <>
            <div className="p-10">
                <h1 className="mb-8 font-extrabold text-4xl">Register</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <form onSubmit={handleRegister}>
                        <div className="mt-4">
                            <label className="block font-semibold" htmlFor="fullName">Full Name</label>
                            <input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full shadow-inner bg-gray-100 rounded-lg placeholder-black text-2xl p-4 border-none mt-1"
                                id="fullName"
                                type="text"
                                name="fullName"
                                required
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block font-semibold" htmlFor="email">Email</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full shadow-inner bg-gray-100 rounded-lg placeholder-black text-2xl p-4 border-none mt-1"
                                id="email"
                                type="email"
                                name="email"
                                required
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block font-semibold" htmlFor="password">Password</label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full shadow-inner bg-gray-100 rounded-lg placeholder-black text-2xl p-4 border-none mt-1"
                                id="password"
                                type="password"
                                name="password"
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="flex items-center justify-between mt-8">
                            <button
                                type="submit"
                                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                            >
                                Register
                            </button>
                            <a className="font-semibold cursor-pointer" onClick={() => navigate("/auth/login")}>
                                Already registered?
                            </a>
                        </div>
                    </form>

                    <aside>
                        <div className="bg-gray-100 p-8 rounded">
                            <h2 className="font-bold text-2xl">Instructions</h2>
                            <ul className="list-disc mt-4 list-inside">
                                <li>All users must provide a valid email address and password to create an account.</li>
                                <li>Users must not use offensive, vulgar, or otherwise inappropriate language in their username or profile information.</li>
                                <li>Users must not create multiple accounts for the same person.</li>
                            </ul>
                        </div>
                    </aside>

                </div>
            </div>
        </> 
    )
}

export default RegisterPage