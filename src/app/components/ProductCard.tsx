import { motion } from "motion/react";

interface Product {
  id: number;
  title: string;
  price: string;
  image: string[]; 
  seller: string;
  channel: string;
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

// === 1. ОСНОВНАЯ КАРТОЧКА ТОВАРА ===
export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        {product.image && product.image.length > 0 ? (
          <img
            src={product.image[0]} 
            alt={product.title}
            className="size-full object-cover"
            loading="lazy"
          />
        ) : (
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

// === 2. СЛУЖЕБНЫЙ КОМПОНЕНТ ДЛЯ ЗАГРУЗКИ (СКЕЛЕТОН) ===
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      {/* Имитируем квадратную картинку */}
      <div className="aspect-square bg-gray-200" />
      
      {/* Имитируем текст */}
      <div className="p-3 space-y-2">
        {/* Строки названия */}
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        
        {/* Имя канала */}
        <div className="h-2 bg-gray-200 rounded w-1/3 pt-1" />
        
        {/* Цена */}
        <div className="h-4 bg-gray-200 rounded w-2/3 pt-2" />
      </div>
    </div>
  );
}