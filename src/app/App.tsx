import { useState, useEffect, useMemo } from "react";
import { ProductCard, ProductCardSkeleton } from "./components/ProductCard";
import { ProductDetail } from "./components/ProductDetail";
import { FilterBar } from "./components/FilterBar";
import { supabase } from "./supabaseClient";

interface SupabaseProduct {
  id: number;
  description: string;
  price_uzs: number;
  photo_url: string[];
  size: string;
  seller_district: string;
  seller: string;
  is_active: boolean;
  category: string;
  channel_username: string;
  telegram_post_id: number;
  created_at: string;
}

const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export default function App() {
  const [activeFilters, setActiveFilters] = useState({ 
    category: "Все", priceFrom: "", priceTo: "", size: "Все" 
  });
  
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Функция загрузки данных
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
          price_uzs: item.price_uzs, 
          image: item.photo_url,
          seller: item.seller || "Админ",
          seller_district: item.seller_district || "Ташкент",
          channel_username: item.channel_username,
          telegram_post_id: item.telegram_post_id,
          category: item.category || "Другое",
          description: item.description,
          size: item.size || "M"
        }));
        setProducts(adaptedProducts);
      }
    } catch (err) {
      console.error("Не удалось загрузить товары:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts(true);
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.setHeaderColor('bg_color');
      tg.expand();
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProducts(false);
  };

  // Логика фильтрации (работает на базе activeFilters)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeFilters.category === "Все" || p.category === activeFilters.category;
      const matchesSize = activeFilters.size === "Все" || p.size === activeFilters.size;
      const price = Number(p.price_uzs) || 0;
      const matchesPrice = 
        (!activeFilters.priceFrom || price >= Number(activeFilters.priceFrom)) &&
        (!activeFilters.priceTo || price <= Number(activeFilters.priceTo));
      
      return matchesCategory && matchesSize && matchesPrice;
    });
  }, [products, activeFilters]);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {isRefreshing && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-gray-900/80 text-white text-xs px-4 py-2 rounded-full backdrop-blur-sm animate-pulse shadow-md">
            Обновление...
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-6 pt-2 px-2">
          <div className="w-8 h-8" />
          <div className="flex flex-col items-center flex-1 text-center">
            <h1 className="text-[16px] font-bold text-gray-900 leading-tight">iBuyNasvay</h1>
          </div>
          <button onClick={handleRefresh} className="w-8 h-8 flex items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
          </button>
        </header>

        <FilterBar onApply={(filters: any) => setActiveFilters(filters)} />

        {loading ? (
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-16 text-gray-500">Товары не найдены</div>
        )}
      </div>

      {selectedProduct && (
        <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}