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

const formatPrice = (price: number) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export default function App() {
  const [activeFilters, setActiveFilters] = useState({ category: "Все", priceFrom: "", priceTo: "", size: "Все" });
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const fetchProducts = async (showGlobalLoading = true) => {
    try {
      if (showGlobalLoading) setLoading(true);
      const { data } = await supabase.from("products").select("*").eq("is_active", true).order("id", { ascending: false });
      if (data) {
        const adapted = data.map((item: SupabaseProduct) => ({
          id: item.id, title: item.description, price: `${formatPrice(item.price_uzs)} UZS`,
          price_uzs: item.price_uzs, image: item.photo_url, seller: item.seller || "Админ",
          seller_district: item.seller_district || "Ташкент", category: item.category || "Другое",
          size: item.size || "M"
        }));
        setProducts(adapted);
      }
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchProducts(true);
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      const userId = tg.initDataUnsafe.user?.id?.toString();
      if (userId) {
        supabase.from('favorites').select('product_id').eq('user_id', userId)
          .then(({ data }) => data && setFavorites(data.map(i => i.product_id)));
      }
    }
  }, []);

  const toggleFavorite = async (productId: number) => {
    const userId = (window as any).Telegram?.WebApp.initDataUnsafe.user?.id?.toString();
    if (!userId) return;
    const isFavorited = favorites.includes(productId);
    
    if (isFavorited) {
      setFavorites(prev => prev.filter(id => id !== productId));
      await supabase.from('favorites').delete().match({ user_id: userId, product_id: productId });
      showToast("Удалено из избранного");
    } else {
      setFavorites(prev => [...prev, productId]);
      await supabase.from('favorites').insert({ user_id: userId, product_id: productId });
      showToast("Добавлено в избранное");
    }
  };

  const displayProducts = useMemo(() => {
    let filtered = products.filter((p) => {
      const matchesCategory = activeFilters.category === "Все" || p.category === activeFilters.category;
      const matchesSize = activeFilters.size === "Все" || p.size === activeFilters.size;
      const price = Number(p.price_uzs) || 0;
      return matchesCategory && matchesSize && 
             (!activeFilters.priceFrom || price >= Number(activeFilters.priceFrom)) &&
             (!activeFilters.priceTo || price <= Number(activeFilters.priceTo));
    });

    if (activeTab === 'favorites') {
      filtered = filtered.filter(p => favorites.includes(p.id));
    }
    return filtered;
  }, [products, activeFilters, activeTab, favorites]);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Хедер */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-40 px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="w-8"></div>
        <div className="text-center">
          <h1 className="text-lg font-bold text-gray-900 leading-tight">iBuyNasvay</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Маркетплейс</p>
        </div>
        <button 
          onClick={() => fetchProducts(true)} 
          className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Компактные кнопки табов */}
        <div className="flex gap-2 mb-4 justify-center">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${activeTab === 'all' ? 'bg-black text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            Все товары
          </button>
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${activeTab === 'favorites' ? 'bg-black text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            ❤️ Избранное
          </button>
        </div>

        <FilterBar onApply={setActiveFilters} activeFilters={activeFilters} />

        <div className="grid grid-cols-3 gap-3">
          {loading ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />) : 
            displayProducts.length > 0 ? (
              displayProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={() => toggleFavorite(product.id)}
                  onClick={() => setSelectedProduct(product)} 
                />
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500 py-10">
                {activeTab === 'favorites' ? "Список избранного пуст" : "Товары не найдены"}
              </p>
            )
          }
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-20 left-4 right-4 z-50 flex justify-center">
          <div className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium shadow-xl animate-bounce">
            {toast}
          </div>
        </div>
      )}

      {selectedProduct && (
        <ProductDetail 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          isFavorite={favorites.includes(selectedProduct.id)}
          onToggleFavorite={() => toggleFavorite(selectedProduct.id)}
        />
      )}
    </div>
  );
}