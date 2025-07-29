import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../configs/auth";

// create context
export const AuthContext = createContext({
    user: null,
    setUser: () => {},
});

export default function AuthContextProvider({children}) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [name, setName] = useState(null);
    const [isLoadPage, setLoadPage] = useState(null);
    const value = {user, role, name, setUser};

    useEffect(() => {
        setLoadPage(true)
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // set user to user
                setUser(user);
                
                // Example: fetch user role from Firestore
                (async () => {
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);
                    console.log(docSnap)
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setRole(data.role);
                        setName(data.name);

                        console.log("User Info:", {
                            uid: user.uid,
                            name: data.name,
                            role: data.role,
                        });
                    }
                })();

            } else {
                // no user in here
                setUser(null);
            }

            setLoadPage(false);
        });

        return () => {
            unsubscribe()
        }

    }, [])

    if (isLoadPage) {
        return (
            <div>loading</div>
        )
    }

    return <AuthContext value={ value }>{children}</AuthContext>;
}