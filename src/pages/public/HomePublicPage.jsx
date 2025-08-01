import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../configs/auth';
import { useOutletContext } from 'react-router';

function HomePublicPage() {
  const { selectedCategory, searchTerm } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

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
        setCurrentPage(1); // reset to first page on new filter/search
      } catch (err) {
        console.error("Failed to fetch products:", err);
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

  return (
    <div className="bg-[#f5f7fa] py-10 px-5 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Explore Our Products</h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {currentProducts.map(product => (
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

          {/* Pagination */}
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
