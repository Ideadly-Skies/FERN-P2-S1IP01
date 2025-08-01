import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../configs/auth';
import { useOutletContext } from 'react-router';
import { where, query } from 'firebase/firestore';

function HomePublicPage() {
  const { selectedCategory, searchTerm } = useOutletContext()
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    async function fetchFilteredProducts() {
      try {
        let q = collection(db, "products");

        // category filter
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
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    }

    fetchFilteredProducts();
  }, [selectedCategory, searchTerm]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  function paginate(pageNumber) {
    setCurrentPage(pageNumber);
  }

  return (
    <div className="bg-[#f5f7fa] py-10 px-5 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Explore Our Products</h1>
      
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
      <div className="flex justify-center mt-10 space-x-2 items-center">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &lt; Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number, idx) => {
          // Show first, last, and nearby pages (e.g., 1 2 3 ... 7)
          if (
            number === 1 ||
            number === totalPages ||
            Math.abs(currentPage - number) <= 1
          ) {
            return (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-1 border rounded ${
                  currentPage === number ? 'border-black font-bold' : ''
                }`}
              >
                {number}
              </button>
            );
          } else if (
            number === currentPage - 2 ||
            number === currentPage + 2
          ) {
            return <span key={idx}>...</span>;
          }
          return null;
        })}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
}

export default HomePublicPage;