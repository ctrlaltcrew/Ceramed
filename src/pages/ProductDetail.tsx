import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  size?: string;
  color?: string;
  image_url: string;
  benefits?: string[];
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error("Error fetching product:", error);
      else setProduct(data);
    }

    fetchProduct();
  }, [id]);

  if (!product) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="container mx-auto px-6 py-10">
      <Link
        to="/products"
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        ← Back to Products
      </Link>

      <div className="flex flex-col md:flex-row gap-10">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full md:w-1/2 rounded-xl shadow-md"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <p className="text-lg font-semibold mb-2">Price: ${product.price}</p>
          {product.size && <p className="text-gray-600 mb-2">Size: {product.size}</p>}
          {product.color && <p className="text-gray-600 mb-6">Color: {product.color}</p>}
          {product.benefits && product.benefits.length > 0 && (
            <ul className="list-disc pl-5 text-gray-700 mb-6">
              {product.benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}

          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
