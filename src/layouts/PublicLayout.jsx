import { Outlet } from "react-router"

import AmazonNavbar from "../components/Navbar/AmazonNavbar"
import AmazonFooter from "../components/Footer/AmazonFooter"
import { useState } from "react"

function PublicLayout() {
    const [selectedCategory, setSelectedCategory] = useState("all")

    return (
        <>
            <AmazonNavbar onCategoryChange={setSelectedCategory}/> 
            <Outlet context={{selectedCategory}}/>  
            <AmazonFooter/>
        </>
    )
}

export default PublicLayout