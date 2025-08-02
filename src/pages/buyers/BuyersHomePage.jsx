// src/pages/BuyersHomePage.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../configs/auth';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router';
import { useCart } from '../../contexts/CartContext';

function BuyersHomePage() {
  const { selectedCategory, searchTerm } = useOutletContext();
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [generalProducts, setGeneralProducts] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  const [loading, setLoading] = useState(true);

  const [currentRecommendedPage, setCurrentRecommendedPage] = useState(1);
  const [currentGeneralPage, setCurrentGeneralPage] = useState(1);

  const productsPerPage = 12;
  const recommendedPerPage = 4;
  const navigate = useNavigate();

  const { cart } = useCart();
  const cartCategories = [...new Set(cart.map(item => item.category))];
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); 
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        // Recommended products from cart categories, filtered by selectedCategory if set
        let recommended = [];

        if (cartCategories.length > 0) {
          // Determine which categories to query
          const categoriesToQuery =
            selectedCategory && selectedCategory !== "all"
              ? cartCategories.includes(selectedCategory)
                ? [selectedCategory] // restrict to selected category if it's in cart
                : []                 // selectedCategory not relevant to cart → show nothing
              : cartCategories;      // selectedCategory is "all" → show all cart categories

          for (const category of categoriesToQuery) {
            const q = query(collection(db, 'products'), where('category', '==', category));
            const snap = await getDocs(q);
            const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            recommended.push(...items);
          }

          // Remove cart items from recommendation
          const cartIds = new Set(cart.map(item => item.id));
          recommended = recommended.filter(p => !cartIds.has(p.id));
        }

        setRecommendedProducts(recommended);

        // General products (search + selectedCategory)
        let generalQuery = collection(db, 'products');
        if (selectedCategory && selectedCategory !== "all") {
          generalQuery = query(generalQuery, where('category', '==', selectedCategory));
        }

        const generalSnap = await getDocs(generalQuery);
        let general = generalSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (debouncedSearchTerm.trim() !== "") {
          general = general.filter(product =>
            product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          );
        }

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
  }, [selectedCategory, searchTerm, cart, debouncedSearchTerm]);

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  const filteredRecommended = recommendedProducts.filter(product =>
    product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
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
                  <p className="text-[#B12704] font-bold text-sm">${product.price.toLocaleString()}</p>
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
                  <p className="text-[#B12704] font-bold text-sm">${product.price.toLocaleString()}</p>
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
