import { Outlet } from "react-router"

function PublicLayout() {
    return (
        <>
            <div>-- Main Layout --</div>        
            <Outlet/>  
        </>
    )
}

export default PublicLayout