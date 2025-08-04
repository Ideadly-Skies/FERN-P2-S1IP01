import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router";

// public page
import AboutPublicPage from './pages/public/AboutPublicPage';
import HomePublicPage from './pages/public/HomePublicPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProductDetail from './pages/public/ProductDetailPage';

// buyers page
import BuyersHomePage from './pages/buyers/BuyersHomePage';
import CartPage from './pages/buyers/CartPage';

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

// cart updating
import { useDispatch, useSelector } from "react-redux";
import { loadCart, persistCart } from "./redux/features/cart/cartSlice";

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
      },
      {
        index: true,
        path: "product/:slug",
        element: <ProductDetail/>
      },
      {
        index: true,
        path : "cart",
        element: <CartPage/>
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
    element: (
      <BuyersProtectedPage>
        <PublicLayout/>
      </BuyersProtectedPage>
    ),  
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
      {
        index: true,
        path: "product/:slug",
        element: <ProductDetail/>
      },
      // {
      //   index: true,
      //   path: "seed",
      //   element: <DummySeeder/>
      // }
    ],
  },
]);

function CartSync() {
  const { items: cart, initialized } = useSelector((state) => state.cart);
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();

  // Only load cart when user logs in and it's not yet initialized
  useEffect(() => {
    if (user?.uid && !initialized) {
      dispatch(loadCart(user.uid));
    }
  }, [user?.uid, initialized, dispatch]);

  // Persist to Firestore only after initial load
  useEffect(() => {
    if (user?.uid && initialized) {
      dispatch(persistCart({ uid: user.uid, cart }));
    }
  }, [cart, user?.uid, initialized, dispatch]);

  return null;
}

function App() {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { items: cart, initialized } = useSelector((state) => state.cart);

  useEffect(() => {
    if (user?.uid) {
      dispatch(loadCart(user.uid));
    }
  }, [user?.uid, dispatch]);

  useEffect(() => {
    if (user?.uid && initialized) {
      dispatch(persistCart({ uid: user.uid, cart }));
    }
  }, [cart, user?.uid, initialized, dispatch]);

  return (
    <>
      <AuthContextProvider>
        <CartSync />
        <RouterProvider router={router} />
      </AuthContextProvider>  
    </>
  )
}

export default App