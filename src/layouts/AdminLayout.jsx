import { Outlet } from "react-router"
import { onAuthStateChanged } from "firebase/auth"
import { useEffect } from "react"
import { useNavigate } from 'react-router'
import Swal from "sweetalert2"

// to check if user is logged in or not
import { auth } from "../../configs/auth"
// import { useContext } from "react"
// import { AuthContext } from "../contexts/AuthContext"

function AdminLayout() {
    const navigate = useNavigate()
    // const { role, name } = useContext(AuthContext)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // console.log("Role:", role, "Name:", name);
                 
                // const uid = user.uid;
                Swal.fire({
                    icon: "error",
                    text: `user ${user.email} is already logged in! can't access the authentication page`,
                }); 
                navigate("/") 
            }
        });

    }, [])

    return (
        <>
            <Outlet/>
        </>
    )
}

export default AdminLayout