import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../configs/auth";

// create context
export const AuthContext = createContext({
  user: null,
  setUser: () => {},
});

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);
  const [isLoadPage, setLoadPage] = useState(true);

  const value = { user, role, name, isLoadPage, setUser };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoadPage(true);
      if (user) {
        setUser(user);
        (async () => {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
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
          setLoadPage(false);
        })();
      } else {
        setUser(null);
        setRole(null);
        setName(null);
        setLoadPage(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoadPage) return <div>loading...</div>;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}