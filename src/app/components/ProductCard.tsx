import { motion } from "motion/react";
import { Heart, Share2 } from "lucide-react";

interface Product {
  id: number;
  title: string;
  price_value: number;
  currency: string;
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
  
  // Форматирование цены: только число с пробелами
  const formatPrice = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Функция для вызова Telegram Share (switchInlineQuery)
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.switchInlineQuery(`share_product_${product.id}`, ['users', 'groups', 'channels']);
    }
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 relative"
    >
      {/* Кнопки действий: Поделиться и Избранное */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button 
          onClick={handleShare}
          className="p-1.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm active:scale-90 transition-transform"
        >
          <Share2 className="w-4 h-4 text-gray-600" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className="p-1.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm active:scale-90 transition-transform"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} 
          />
        </button>
      </div>

      {/* Фото товара */}
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
        {/* Заголовок */}
        <h3 className="text-xs font-medium text-gray-900 line-clamp-2 mb-2">
          {product.title}
        </h3>
        
        {/* Блок с ценой и валютным бейджем */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-gray-900 truncate">
            {formatPrice(product.price_value)}
          </p>
          
          <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider
            ${product.currency === 'USD' ? 'bg-green-100 text-green-700' : 
              product.currency === 'EUR' ? 'bg-blue-100 text-blue-700' : 
              'bg-gray-100 text-gray-600'}`}>
            {product.currency}
          </span>
        </div>
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
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}