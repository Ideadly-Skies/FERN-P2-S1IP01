import { Outlet } from "react-router"

import AmazonNavbar from "../components/Navbar/AmazonNavbar"
import AmazonFooter from "../components/Footer/AmazonFooter"

function PublicLayout() {
    return (
        <>
            <AmazonNavbar/> 
            <Outlet/>  
            <AmazonFooter/>
        </>
    )
}

export default PublicLayout