import { useState } from "react";
import { ProductCard } from "./components/ProductCard";
import { ProductDetail } from "./components/ProductDetail";
import { CategoryFilter } from "./components/CategoryFilter";

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  seller: string;
  channel: string;
  description: string;
  category: string;
  date: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    title: "Стильный желтый спортивный костюм",
    price: "4 500 ₽",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    seller: "Marina Shop",
    channel: "@fashion_deals",
    description: "Яркий и удобный спортивный костюм. Отлично подходит для занятий спортом и повседневной носки. Материал: хлопок 80%, полиэстер 20%. Размеры в наличии: S, M, L, XL.",
    category: "Одежда",
    date: "27 мая 2026"
  },
  {
    id: 2,
    title: "Качественные беспроводные наушники",
    price: "2 800 ₽",
    image: "https://images.unsplash.com/photo-1515940175183-6798529cb860?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    seller: "Tech Store",
    channel: "@electronics_city",
    description: "Современные беспроводные наушники с отличным качеством звука. Bluetooth 5.0, время работы до 30 часов. Активное шумоподавление и удобная посадка.",
    category: "Электроника",
    date: "28 мая 2026"
  },
  {
    id: 3,
    title: "Вешалка для одежды в минималистичном стиле",
    price: "1 200 ₽",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    seller: "Home Decor",
    channel: "@home_style",
    description: "Элегантная напольная вешалка из натурального дерева. Идеально впишется в любой интерьер. Размеры: 170см высота, устойчивая конструкция.",
    category: "Для дома",
    date: "26 мая 2026"
  },
  {
    id: 4,
    title: "Ноутбук Apple MacBook",
    price: "89 990 ₽",
    image: "https://images.unsplash.com/photo-1636115305669-9096bffe87fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    seller: "Apple Premium",
    channel: "@apple_store_ru",
    description: "MacBook Air M2, 8GB RAM, 256GB SSD. Состояние отличное, полный комплект, гарантия 6 месяцев. Цвет серебристый.",
    category: "Электроника",
    date: "28 мая 2026"
  },
  {
    id: 5,
    title: "Черный мужской костюм",
    price: "12 000 ₽",
    image: "https://images.unsplash.com/photo-1603189343302-e603f7add05a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    seller: "Men's Fashion",
    channel: "@mens_style",
    description: "Классический деловой костюм. Пиджак и брюки. Состав: шерсть 70%, полиэстер 30%. Размеры: 48, 50, 52, 54.",
    category: "Одежда",
    date: "27 мая 2026"
  },
  {
    id: 6,
    title: "Модная женская сумка",
    price: "3 200 ₽",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    seller: "Fashion Bags",
    channel: "@bag_shop",
    description: "Стильная сумка из эко-кожи высокого качества. Несколько внутренних отделений, регулируемый ремень. Цвета в наличии: черный, бежевый, коричневый.",
    category: "Аксессуары",
    date: "28 мая 2026"
  },
  {
    id: 7,
    title: "Комнатное растение в керамическом горшке",
    price: "890 ₽",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    seller: "Green Home",
    channel: "@plants_shop",
    description: "Красивое комнатное растение в стильном белом керамическом горшке. Неприхотливо в уходе, отлично очищает воздух.",
    category: "Для дома",
    date: "27 мая 2026"
  },
  {
    id: 8,
    title: "Смартфон с аксессуарами",
    price: "15 500 ₽",
    image: "https://images.unsplash.com/photo-1620783770629-122b7f187703?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    seller: "Mobile World",
    channel: "@smartphone_deals",
    description: "iPhone 12, 128GB, черный. Состояние хорошее, в комплекте чехол и защитное стекло. Батарея 87%.",
    category: "Электроника",
    date: "28 мая 2026"
  },
  {
    id: 9,
    title: "Декоративные вазы для интерьера",
    price: "1 890 ₽",
    image: "https://images.unsplash.com/photo-1572048572872-2394404cf1f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    seller: "Decor Studio",
    channel: "@home_decor_store",
    description: "Набор из 2-х стильных керамических ваз в современном стиле. Отлично дополнят интерьер гостиной или спальни.",
    category: "Для дома",
    date: "26 мая 2026"
  }
];

const categories = ["Все", "Одежда", "Электроника", "Для дома", "Аксессуары"];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = mockProducts.filter((product) => {
    const matchesCategory = selectedCategory === "Все" || product.category === selectedCategory;
    return matchesCategory;
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

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
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