import { useState, useEffect } from "react";
import { ProductCard } from "./components/ProductCard";
import { ProductDetail } from "./components/ProductDetail";
import { CategoryFilter } from "./components/CategoryFilter";
import { supabase } from "./supabaseClient";

// Структура, которая приходит напрямую из Supabase от бэкендера
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
  // Используем type 'any', чтобы всплывающее окно ProductDetail тоже не выдавало ошибок типов
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        
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
          // Превращаем данные бэкенда в объект, который на 100% удовлетворяет интерфейсу Figma-карточки
          const adaptedProducts = data.map((item: SupabaseProduct) => ({
            id: item.id,
            title: item.description, // Описание идет в заголовок карточки
            price: `${formatPrice(item.price_uzs)} UZS`,
            image: item.photo_url,
            seller: item.seller_district, // Район Ташкента
            channel: `@tg_channel`, // Временная заглушка для канала
            category: item.category || "Одежда", // Категория для фильтра
            description: item.description, // Передаем и полное описание для экрана деталей
            size: item.size
          }));
          
          setProducts(adaptedProducts);
        }
      } catch (err) {
        console.error("Не удалось загрузить товары:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    return selectedCategory === "Все" || product.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center mb-8 pt-2">
          <h1 className="text-3xl font-light tracking-tight text-gray-900">
            Nearby
          </h1>
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