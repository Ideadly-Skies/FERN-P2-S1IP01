import { Outlet } from "react-router"
import { onAuthStateChanged } from "firebase/auth"
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router'
import Swal from "sweetalert2"
import { auth } from "../../configs/auth"

import AmazonFooter from "../components/Footer/AmazonFooter"
import AmazonNavbar from "../components/Navbar/AmazonNavbar"

function MainLayout() {
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [searchTerm, setSearchTerm] = useState("");
    
    const navigate = useNavigate()
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
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
            <AmazonNavbar onCategoryChange={setSelectedCategory} onSearchChange={setSearchTerm}/>
            <Outlet context={{selectedCategory, searchTerm}}/>  
            <AmazonFooter/>
        </>
    )
}

export default MainLayout