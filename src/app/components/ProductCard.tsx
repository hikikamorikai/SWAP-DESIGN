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
  // Добавляем эти поля для избранного:
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

// === ОСНОВНАЯ КАРТОЧКА ТОВАРА ===
export function ProductCard({ product, onClick, isFavorite, onToggleFavorite }: ProductCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
    >
      {/* Кнопка сердечка */}
      <button 
        onClick={(e) => { 
          e.stopPropagation(); // Не дает сработать onClick всей карточки
          onToggleFavorite(); 
        }}
        className="absolute top-2 right-2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm active:scale-90 transition-transform"
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

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

// === СКЕЛЕТОН ОСТАЕТСЯ БЕЗ ИЗМЕНЕНИЙ ===
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-2 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}