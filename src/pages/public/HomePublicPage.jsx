import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../configs/auth';
import { useOutletContext } from 'react-router';
import { useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import noDataAnimation from "../../assets/No-Data.json";
import Swal from 'sweetalert2';

function HomePublicPage() {
  const { selectedCategory, searchTerm } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedImages, setLoadedImages] = useState({});
  const productsPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFilteredProducts() {
      setLoading(true);
      try {
        let q = collection(db, "products");
        if (selectedCategory !== "all") {
          q = query(q, where("category", "==", selectedCategory));
        }

        const snapshot = await getDocs(q);
        const filtered = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

        setProducts(filtered);
        setLoadedImages({});
        setCurrentPage(1);
      } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Failed to fetch products",
            text: err,
          });
      } finally {
        setLoading(false);
      }
    }

    fetchFilteredProducts();
  }, [selectedCategory, searchTerm]);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="bg-[#f5f7fa] py-10 px-5 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Explore Our Products</h1>
      <h2 className="text-xl text-center text-gray-700 mb-4">Sign in to gain the full experience</h2>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : currentProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Lottie animationData={noDataAnimation} loop={true} className="w-80 h-80" />
          <p className="text-gray-600 mt-4 text-lg font-medium">No products found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {currentProducts.map(product => (
              <div key={product.id} className="bg-white rounded shadow p-4" onClick={() => navigate(`product/${product.id}`)}>
                
                {/* Grey skeleton placeholder */}
                {!loadedImages[product.id] && (
                  <div className="w-full h-40 bg-gray-200 animate-pulse mb-3 rounded" />
                )}

                {/* Real image when loaded */}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  onLoad={() => handleImageLoad(product.id)}
                  style={{
                    display: loadedImages[product.id] ? "block" : "none"
                  }}
                  className="w-full h-40 object-cover mb-3 rounded"
                />

                <h2 className="text-sm font-semibold">{product.name}</h2>
                <p className="text-gray-600 text-xs mb-1 capitalize">{product.category}</p>
                <p className="text-[#B12704] font-bold text-sm">${product.price.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Simple pagination */}
          {products.length > productsPerPage && (
            <div className="flex justify-center mt-10 items-center gap-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border rounded disabled:opacity-50"
              >
                &larr; Previous
              </button>

              <span className="text-sm text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border rounded disabled:opacity-50"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HomePublicPage;
