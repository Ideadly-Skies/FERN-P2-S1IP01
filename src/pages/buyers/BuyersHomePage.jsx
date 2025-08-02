// src/pages/BuyersHomePage.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../configs/auth';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router';

function BuyersHomePage() {
  const { selectedCategory, searchTerm } = useOutletContext();
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [generalProducts, setGeneralProducts] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  const [loading, setLoading] = useState(true);

  const [currentRecommendedPage, setCurrentRecommendedPage] = useState(1);
  const [currentGeneralPage, setCurrentGeneralPage] = useState(1);

  const [recommendedSearchTerm, setRecommendedSearchTerm] = useState("");

  const productsPerPage = 12;
  const recommendedPerPage = 4;
  const navigate = useNavigate();

  const cartCategory = "";

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
          // Fetch recommended (category === "")
          const cartQuery = query(collection(db, 'products'), where('category', '==', cartCategory));
          const cartSnap = await getDocs(cartQuery);
          const recommended = cartSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRecommendedProducts(recommended);

          // Build general query based on selectedCategory
          let generalQuery = collection(db, 'products');
          if (selectedCategory && selectedCategory !== "all") {
            generalQuery = query(generalQuery, where('category', '==', selectedCategory));
          }

          const generalSnap = await getDocs(generalQuery);
          let general = generalSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          // Apply search term filtering
          if (searchTerm.trim() !== "") {
            general = general.filter(product =>
              product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }

          // Remove recommended from general
          const recommendedIds = new Set(recommended.map(p => p.id));
          const generalFiltered = general.filter(p => !recommendedIds.has(p.id));

          setGeneralProducts(generalFiltered);
          setCurrentRecommendedPage(1);
          setCurrentGeneralPage(1);
      } catch (err) {
          console.error("Failed to fetch products:", err);
      } finally {
          setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  const filteredRecommended = recommendedProducts.filter(product =>
    product.name.toLowerCase().includes(recommendedSearchTerm.toLowerCase())
  );

  const totalRecommendedPages = Math.ceil(filteredRecommended.length / recommendedPerPage);
  const totalGeneralPages = Math.ceil(generalProducts.length / productsPerPage);

  const currentRecommended = filteredRecommended.slice(
    (currentRecommendedPage - 1) * recommendedPerPage,
    currentRecommendedPage * recommendedPerPage
  );

  const currentGeneral = generalProducts.slice(
    (currentGeneralPage - 1) * productsPerPage,
    currentGeneralPage * productsPerPage
  );

  return (
    <div className="bg-[#f5f7fa] py-10 px-5 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome to Buyers Home Page</h1>
      <h2 className="text-xl text-center text-gray-700 mb-4">Explore the best deals and find your perfect purchase!</h2>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Recommended Section */}
          <div className="max-w-6xl mx-auto mb-10">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Recommended Based on Your Cart</h3>

            <input
              type="text"
              value={recommendedSearchTerm}
              onChange={(e) => setRecommendedSearchTerm(e.target.value)}
              placeholder="Search recommended products"
              className="mb-4 w-full px-4 py-2 border rounded text-sm text-gray-700"
            />

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {currentRecommended.map(product => (
                <div key={product.id} className="bg-white rounded shadow p-4 cursor-pointer" onClick={() => navigate(`product/${product.id}`)}>
                  {!loadedImages[product.id] && <div className="w-full h-40 bg-gray-200 animate-pulse mb-3 rounded" />}
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    onLoad={() => handleImageLoad(product.id)}
                    style={{ display: loadedImages[product.id] ? "block" : "none" }}
                    className="w-full h-40 object-cover mb-3 rounded"
                  />
                  <h2 className="text-sm font-semibold">{product.name}</h2>
                  <p className="text-gray-600 text-xs mb-1 capitalize">{product.category}</p>
                  <p className="text-[#B12704] font-bold text-sm">${(product.price / 100).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {filteredRecommended.length > recommendedPerPage && (
              <div className="flex justify-center mt-10 items-center gap-6">
                <button
                  onClick={() => setCurrentRecommendedPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentRecommendedPage === 1}
                  className="px-4 py-2 bg-white border rounded disabled:opacity-50"
                >
                  &larr; Previous
                </button>
                <span className="text-sm text-gray-700 font-medium">
                  Page {currentRecommendedPage} of {totalRecommendedPages}
                </span>
                <button
                  onClick={() => setCurrentRecommendedPage(prev => Math.min(prev + 1, totalRecommendedPages))}
                  disabled={currentRecommendedPage === totalRecommendedPages}
                  className="px-4 py-2 bg-white border rounded disabled:opacity-50"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </div>

          {/* General Products Section */}
          <div className="max-w-6xl mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Explore More Products</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {currentGeneral.map(product => (
                <div key={product.id} className="bg-white rounded shadow p-4 cursor-pointer" onClick={() => navigate(`product/${product.id}`)}>
                  {!loadedImages[product.id] && <div className="w-full h-40 bg-gray-200 animate-pulse mb-3 rounded" />}
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    onLoad={() => handleImageLoad(product.id)}
                    style={{ display: loadedImages[product.id] ? "block" : "none" }}
                    className="w-full h-40 object-cover mb-3 rounded"
                  />
                  <h2 className="text-sm font-semibold">{product.name}</h2>
                  <p className="text-gray-600 text-xs mb-1 capitalize">{product.category}</p>
                  <p className="text-[#B12704] font-bold text-sm">${(product.price / 100).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {generalProducts.length > productsPerPage && (
              <div className="flex justify-center mt-10 items-center gap-6">
                <button
                  onClick={() => setCurrentGeneralPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentGeneralPage === 1}
                  className="px-4 py-2 bg-white border rounded disabled:opacity-50"
                >
                  &larr; Previous
                </button>
                <span className="text-sm text-gray-700 font-medium">
                  Page {currentGeneralPage} of {totalGeneralPages}
                </span>
                <button
                  onClick={() => setCurrentGeneralPage(prev => Math.min(prev + 1, totalGeneralPages))}
                  disabled={currentGeneralPage === totalGeneralPages}
                  className="px-4 py-2 bg-white border rounded disabled:opacity-50"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default BuyersHomePage;
