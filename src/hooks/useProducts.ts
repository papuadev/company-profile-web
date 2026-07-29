import { useState, useEffect } from "react";
import type { Product } from "../types";
import { productService } from "../services/productService";
import { toast } from "sonner";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter(p => p.objectId !== id));
      toast.success("Product deleted successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete product");
    }
  };

  return { products, loading, error, refetch: fetchProducts, deleteProduct };
}
