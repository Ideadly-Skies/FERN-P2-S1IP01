import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../configs/auth";
import Swal from "sweetalert2";

export default function SearchBar({ onCategoryChange, onSearchChange }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const selectRef = useRef(null);
    const measureRef = useRef(null);
    const [selectWidth, setSelectWidth] = useState(60);

    // debounce timer
    const debounceRef = useRef(null);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                const products = querySnapshot.docs.map(doc => doc.data());
                const uniqueCategories = [...new Set(products.map(p => p.category))];
                setCategories(uniqueCategories);
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Failed to fetch categories",
                    text: err,
                });
            }
        }

        fetchCategories();
    }, []);

    useEffect(() => {
        if (onCategoryChange) {
        onCategoryChange(selectedCategory);
        }

        if (measureRef.current) {
        const width = measureRef.current.offsetWidth;
        setSelectWidth(width + 20);
        }
    }, [selectedCategory, onCategoryChange]);


    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
        if (onSearchChange) {
            onSearchChange(searchTerm);
        }
        }, 500);

        return () => clearTimeout(debounceRef.current);
    }, [searchTerm, onSearchChange]);

    function handleSearchButtonClick() {
        if (onSearchChange) {
            onSearchChange(searchTerm);
        }
    }

    return (
        <div className="flex flex-1 mx-4 h-10 items-center">
            {/* Hidden measurer */}
            <div className="absolute invisible h-0 overflow-hidden whitespace-nowrap">
                <span ref={measureRef} className="text-sm font-normal px-2">
                {selectedCategory === "all"
                    ? "All"
                    : categories.find(c => c === selectedCategory)}
                </span>
            </div>

            {/* Select dropdown */}
            <select
                ref={selectRef}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-black text-sm bg-gray-200 border border-r-0 rounded-l-md px-2 h-full"
                style={{ width: `${selectWidth}px` }}
            >
                <option value="all">All</option>
                {categories.map((category) => (
                <option key={category} value={category}>
                    {category}
                </option>
                ))}
            </select>

            {/* Search input */}
            <input
                type="text"
                placeholder="Search Amazon.com.au"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-2 bg-white text-black h-full"
            />

            {/* Search button */}
            <button
                onClick={handleSearchButtonClick}
                className="bg-[#febd69] px-4 py-2 rounded-r-md text-black h-full"
            >
                <FaSearch />
            </button>
        </div>
    );
}
