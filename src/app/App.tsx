import { useState, useEffect } from "react";
// 1. ИМПОРТ: Добавляем импорт ProductCardSkeleton рядом с ProductCard
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
  category?: string;
  channel_username: string;
  telegram_post_id: number;
  created_at: string;
}

const categories = ["Все", "Одежда", "Обувь", "Аксессуары"];

const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [activeFilters, setActiveFilters] = useState({ 
    category: "Все", priceFrom: "", priceTo: "", size: "Все" 
  });
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
          seller: item.seller || "",
          seller_district: item.seller_district,
          channel_username: item.channel_username,
          telegram_post_id: item.telegram_post_id,
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
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();                  // Сообщаем ТГ, что мини-апп загрузился
      tg.setHeaderColor('bg_color'); // Красим верхнюю панельку телефона под цвет темы
      tg.expand();                 // Разворачиваем приложение на максимум вверх
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true); // Включаем всплывающий текст
    await fetchProducts(false); // Обновляем в фоне
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeFilters.category === "Все" || p.category === activeFilters.category;
    const matchesSize = activeFilters.size === "Все" || p.size === activeFilters.size;
    
    // Преобразуем цену "10 000 UZS" в число 10000 для сравнения
    const price = parseInt(p.price.replace(/\D/g, ""));
    const matchesPrice = 
      (!activeFilters.priceFrom || price >= parseInt(activeFilters.priceFrom)) &&
      (!activeFilters.priceTo || price <= parseInt(activeFilters.priceTo));
    
    return matchesCategory && matchesSize && matchesPrice;
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
        
        {/* --- НОВАЯ ШАПКА --- */}
        <header className="flex items-center justify-between mb-6 pt-2 px-2">
          {/* Пустой блок для симметрии (слева под корзину) */}
          <div className="w-8 h-8" />

          {/* Название и подпись по центру */}
          <div className="flex flex-col items-center flex-1 text-center">
            <h1 className="text-[16px] font-bold text-gray-900 leading-tight">
              iBuyNasvay
            </h1>
            <p className="text-[10px] text-gray-500 font-light mt-0.5">
              Вся ресейл одежда в одном месте
            </p>
          </div>

          {/* Кнопка обновления */}
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className={`w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors rounded-md ${isRefreshing ? 'opacity-40' : ''}`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </header>
        {/* --- КОНЕЦ ШАПКИ --- */}

        <div className="mb-6">
  <FilterBar onApply={(filters) => setActiveFilters(filters)} />
</div>

        {/* 2. ЗАМЕНА ЛОГИКИ ЗАГРУЗКИ: рендерим красивую сетку из 6 скелетонов */}
        {loading ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
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
} //