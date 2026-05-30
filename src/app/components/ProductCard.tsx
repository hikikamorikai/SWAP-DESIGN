import { motion } from "motion/react";

// 1. ИСПРАВЛЯЕМ МОДЕЛЬ: теперь image — это массив строк []
interface Product {
  id: number;
  title: string;
  price: string;
  image: string[]; // Меняем string на string[] под базу Supabase
  seller: string;
  channel: string;
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        {/* 2. ИСПРАВЛЯЕМ ВЫВОД КАРТИНКИ: берем первую фотку из массива */}
        {product.image && product.image.length > 0 ? (
          <img
            src={product.image[0]} // Индекс [0] вытащит первую ссылку из альбома
            alt={product.title}
            className="size-full object-cover"
            loading="lazy"
          />
        ) : (
          // Симпатичная заглушка на случай, если у товара вообще нет фоток
          <div className="size-full flex items-center justify-center text-gray-400 text-[10px]">
            Нет фото
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
          {product.title}
        </h3>
        <p className="text-[10px] text-gray-500 mb-1.5">{product.channel}</p>
        <p className="text-sm font-semibold text-gray-900">{product.price}</p>
      </div>
    </motion.div>
  );
}