import { Outlet } from "react-router"
import { onAuthStateChanged } from "firebase/auth"
import { useEffect } from "react"
import { useNavigate } from 'react-router'
import Swal from "sweetalert2"
import { auth } from "../../configs/auth"

function MainLayout() {
    const navigate = useNavigate()
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                // const uid = user.uid;
                Swal.fire({
                    icon: "error",
                    text: `cannot access the homepage, please log in first!`,
                }); 
                navigate("/public") 
            }
        });
    }, []) 
    
    return (
        <>
            <div>-- Main Layout --</div>        
            <Outlet/>  
        </>
    )
}

export default MainLayout