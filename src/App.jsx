import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router";

// public page
import AboutPublicPage from './pages/public/AboutPublicPage';
import HomePublicPage from './pages/public/HomePublicPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// buyers page
import BuyersHomePage from './pages/buyers/BuyersHomePage';

// seed page
import DummySeeder from './pages/seed/DummySeeder';

// layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';

import { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from './contexts/AuthContext';
import AuthContextProvider from './contexts/AuthContext';

function BuyersProtectedPage({children}){
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent navigation until user context is ready
    if (user === undefined || role === undefined) return;

    // transport into public page
    if (!user || role !== "buyers") {
      navigate("/public", {
        state: history.state,
        replace: true,
      });
    }
    
    // transport to buyers home page 
    else {
      navigate("/", {
        state: history.state,
        replace: true,
      });
    }

  }, [user, role, navigate]);

  console.log("you are protected"); 
  return children;
}

// routes
const router = createBrowserRouter([
  // route for buyers
  {
    path: "/",
    element: (
      <BuyersProtectedPage>
        <MainLayout/>
      </BuyersProtectedPage>
    ), 
    children: [
      {
        index: true,
        element: <BuyersHomePage/>   
      }
    ],
  },

  // authentication page
  {
    path: "/auth",
    element: <AdminLayout />, 
    children: [
      {
        index: true,
        path: "login",
        // displayed in outlet
        element: <LoginPage />
      },
      {
        path: "register",
        // displayed in outlet
        element: <RegisterPage /> 
      }
    ],
  },

  //  public page
  {
    path: "/public",
    element: <PublicLayout />, 
    children: [
      {
        index: true,
        element: <HomePublicPage />
      },
      {
        index: true,
        path: "about",
        element: <AboutPublicPage />
      },
      // {
      //   index: true,
      //   path: "seed",
      //   element: <DummySeeder/>
      // }
    ],
  },
]);

function App() {

  return (
    <>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>  
    </>
  )
}

export default App