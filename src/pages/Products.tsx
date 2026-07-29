import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { X } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types";

export default function Products() {
  const { products, loading } = useProducts();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);



  const categories = ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProduct(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen">
      <Helmet>
        <title>Products | HMNS - Home of Humans</title>
        <meta name="description" content="Explore the full collection of HMNS fragrances." />
      </Helmet>

      <section className="w-full py-24 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col space-y-4 mb-12 text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Our Collection</h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed mx-auto md:mx-0">
              Explore our meticulously crafted fragrances designed to elevate your everyday presence.
            </p>
          </div>

          {/* Category Filter */}
          {!loading && categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-10 justify-center md:justify-start">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category 
                      ? 'bg-black text-white' 
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No products found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <div 
                  key={product.objectId} 
                  onClick={() => setSelectedProduct(product)}
                  className="group cursor-pointer relative overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-zinc-50">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={`HMNS Product: ${product.name}`}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">No Image</div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between bg-white z-10 relative">
                    <div>
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">{product.category}</p>
                      <h3 className="text-lg font-bold text-black mb-2">{product.name}</h3>
                    </div>
                    <p className="mt-4 font-semibold text-black">{formatPrice(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedProduct(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full text-black hover:bg-black hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="md:w-1/2 h-64 md:h-auto bg-zinc-100 flex-shrink-0 relative">
              {selectedProduct.imageUrl ? (
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">No Image</div>
              )}
            </div>

            <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto">
              <span className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">{selectedProduct.category}</span>
              <h2 className="text-3xl font-bold mt-2 mb-4 text-black">{selectedProduct.name}</h2>
              <p className="text-2xl font-medium text-black mb-8">{formatPrice(selectedProduct.price)}</p>
              
              <div className="prose prose-zinc max-w-none">
                <h4 className="text-sm font-bold uppercase tracking-wider text-black mb-2">Description</h4>
                <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">{selectedProduct.description}</p>
              </div>

              <div className="mt-10">
                <button className="w-full py-4 bg-black text-white font-bold rounded-lg hover:bg-zinc-800 transition-colors">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
