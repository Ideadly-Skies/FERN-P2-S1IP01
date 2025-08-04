// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../configs/auth';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { addToCart } from '../../redux/features/cart/cartSlice';

export default function ProductDetail() {
    const { user } = useContext(AuthContext);
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    useEffect(() => {
        async function fetchProduct() {
            try {
                const docRef = doc(db, 'products', slug);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                setProduct({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (err) {
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [slug]);

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (!product) return <div className="text-center p-10">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <img
            src={product.imageUrl}
            alt={product.name}
            className="max-w-[400px] w-full h-auto object-contain mx-auto md:mx-0 rounded-xl shadow"
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">Category: {product.category}</p>
        <p className="text-2xl font-semibold text-green-700 mb-4">${product.price.toLocaleString()}</p>

        <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded font-semibold"
            onClick={() => {
                if (!user) return navigate("/auth/login");
                dispatch(addToCart(product));
                navigate("/cart");
            }}
        >
        Add to Cart
        </button>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">About this item</h2>
          <p className="text-gray-700 text-sm">
            {product.description} 
          </p>
        </div>
      </div>
    </div>
  );
}
