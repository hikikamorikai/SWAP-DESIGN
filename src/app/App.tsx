import { useState, useEffect } from "react";
import { ProductCard } from "./components/ProductCard";
import { ProductDetail } from "./components/ProductDetail";
import { CategoryFilter } from "./components/CategoryFilter";
import { supabase } from "./supabaseClient";

interface SupabaseProduct {
  id: number;
  description: string;
  price_uzs: number;
  photo_url: string;
  size: string;
  seller_district: string;
  is_active: boolean;
  category?: string;
}

const categories = ["Все", "Одежда", "Электроника", "Для дома", "Аксессуары"];

const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Состояние для кастомного всплывающего текста
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProducts = async (showGlobalLoading = true) => {
    try {
      if (showGlobalLoading) setLoading(true);
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("id", { ascending: false });

      if (error) {
        console.error("Ошибка Supabase:", error.message);
        return;
      }

      if (data) {
        const adaptedProducts = data.map((item: SupabaseProduct) => ({
          id: item.id,
          title: item.description,
          price: `${formatPrice(item.price_uzs)} UZS`,
          image: item.photo_url,
          seller: item.seller_district,
          channel: `@tg_channel`,
          category: item.category || "Одежда",
          description: item.description,
          size: item.size
        }));
        
        setProducts(adaptedProducts);
      }
    } catch (err) {
      console.error("Не удалось загрузить товары:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false); // Выключаем всплывающий текст
    }
  };

  useEffect(() => {
    fetchProducts(true);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true); // Включаем всплывающий текст
    await fetchProducts(false); // Обновляем в фоне
  };

  const filteredProducts = products.filter((product) => {
    return selectedCategory === "Все" || product.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 relative">
      
      {/* ВСЕГДА ВСПЛЫВАЮЩИЙ ТЕКСТ (Появляется по центру экрана поверх всего при обновлении) */}
      {isRefreshing && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-gray-900/80 text-white text-xs font-light tracking-wide px-4 py-2 rounded-full backdrop-blur-sm animate-pulse shadow-md">
            Обновление списка...
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Шапка приложения */}
        <div className="flex items-center justify-between mb-8 pt-2 relative">
          <div className="w-6"></div> {/* Заглушка для баланса */}
          
          <h1 className="text-3xl font-light tracking-tight text-gray-900 text-center">
            Nearby
          </h1>
          
          {/* Маленькая, блёклая кнопочка, которая не бросается в глаза */}
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className={`p-1.5 text-gray-300 hover:text-gray-500 transition-colors rounded-md ${isRefreshing ? 'opacity-40' : ''}`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-4 h-4" // Крошечный размер иконки
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>

        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Загрузка товаров...</div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">Товары не найдены</p>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}