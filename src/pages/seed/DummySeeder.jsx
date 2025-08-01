import { useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../configs/auth";
import { query, where, getDocs } from "firebase/firestore";

function DummySeeder() {
  useEffect(() => {
    async function seed() {
      const res = await fetch("https://dummyjson.com/products?limit=100");
      const data = await res.json();

      for (const product of data.products) {
        const q = query(collection(db, "products"), where("name", "==", product.title));
        const existing = await getDocs(q);
        
        if (existing.empty) {
          await addDoc(collection(db, "products"), {
            name: product.title,
            category: product.category,
            price: product.price,
            imageUrl: product.thumbnail,
            description: product.description,
          });
        }        
      }

      alert("Seeding complete!");
    }

    seed();
  }, []);

  return <div>Seeding DummyJSON Data...</div>;
}

export default DummySeeder;