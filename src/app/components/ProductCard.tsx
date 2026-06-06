import { motion } from "motion/react";
import { Heart } from "lucide-react";

interface Product {
  id: number;
  title: string;
  price_value: number; // Обновили: теперь это число
  currency: string;    // Обновили: теперь это валюта
  image: string[]; 
  seller: string;
  channel: string;
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function ProductCard({ product, onClick, isFavorite, onToggleFavorite }: ProductCardProps) {
  
  // Функция для отображения цены
  const formatPrice = (val: number, cur: string) => {
    const formatted = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    switch (cur) {
      case 'USD': return `$${val}`;
      case 'EUR': return `${val}€`;
      default: return `${formatted} UZS`;
    }
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 relative"
    >
      {/* Кнопка сердечка */}
      <button 
        onClick={(e) => { 
          e.stopPropagation(); 
          onToggleFavorite(); 
        }}
        className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm active:scale-90 transition-transform"
      >
        <Heart 
          className={`w-4 h-4 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} 
        />
      </button>

      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        {product.image && product.image.length > 0 ? (
          <img
            src={product.image[0]} 
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
            Нет фото
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
          {product.title}
        </h3>
        <p className="text-[10px] text-gray-500 mb-1.5">{product.channel}</p>
        <p className="text-sm font-semibold text-gray-900">
          {formatPrice(product.price_value, product.currency)}
        </p>
      </div>
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse border border-gray-100">
      <div className="aspect-square bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}