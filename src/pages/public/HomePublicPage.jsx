import React from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { db } from '../../../configs/auth'
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';

function HomePublicPage() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    async function fetchProducts() {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const fetchedProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(fetchedProducts);
    }

    fetchProducts();
  }, []);
  
  return (
    <>
      <div className="bg-[#f5f7fa] py-10 px-5 min-h-screen">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Explore Our Products
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded shadow p-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-cover mb-3 rounded"
              />
              <h2 className="text-sm font-semibold">{product.name}</h2>
              <p className="text-gray-600 text-xs mb-1 capitalize">{product.category}</p>
              <p className="text-[#B12704] font-bold text-sm">${(product.price / 100).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div> 
    </>
  )
}

export default HomePublicPage