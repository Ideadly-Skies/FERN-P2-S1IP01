import { Outlet } from "react-router"

import AmazonNavbar from "../components/Navbar/AmazonNavbar"
import AmazonFooter from "../components/Footer/AmazonFooter"
import { useState } from "react"

function PublicLayout() {
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <>
            <AmazonNavbar onCategoryChange={setSelectedCategory} onSearchChange={setSearchTerm}/> 
            <Outlet context={{selectedCategory, searchTerm}}/>  
            <AmazonFooter/>
        </>
    )
}

export default PublicLayout