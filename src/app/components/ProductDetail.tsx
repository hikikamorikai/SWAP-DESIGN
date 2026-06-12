import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, MessageCircle, Share2, User, MapPin, Calendar, Heart } from "lucide-react";

interface Product {
  id: number;
  title: string;
  price_uzs: string;
  image: string[];
  seller: string;
  seller_district: string;
  category: string;
  channel_username: string;
  telegram_post_id: string | number;
  created_at: string;
  description: string;
}

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function ProductDetail({ product, onClose, isFavorite, onToggleFavorite }: ProductDetailProps) {
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    setIsSent(false);
  }, [product?.id]);

  if (!product) return null;

  const getValidSellerUsername = () => {
    const rawSeller = product.seller || "";
    const cleanUsername = rawSeller.replace(/[@\s]/g, '');
    const isInvalid = ["Админ", "Ташкент", "Не указан", "Канал"].some(word => 
      rawSeller.toLowerCase().includes(word.toLowerCase())
    );

    if (cleanUsername && !isInvalid && cleanUsername.trim() !== "") {
      return cleanUsername;
    }
    return null;
  };

  const sellerUsername = getValidSellerUsername();
  const hasValidSeller = sellerUsername !== null;

  const handleCalculateTaxi = () => {
    if (isSent) return;
    const tg = (window as any).Telegram?.WebApp;
    const botUrl = `https://t.me/nearbytashkent_bot?start=calc_taxi_${product.id}`;
    
    if (tg) {
      if (tg.ready) tg.ready();
      if (tg.HapticFeedback?.impactOccurred) tg.HapticFeedback.impactOccurred('heavy');
      if (tg.showPopup) {
        tg.showPopup({
          title: '🚕 Расчет отправлен!',
          message: 'Сравнение цен на доставку по Ташкенту уже ждет тебя в чате с ботом.',
          buttons: [{ type: 'close', text: 'Понятно' }]
        });
      }
      if (tg.openTelegramLink) tg.openTelegramLink(botUrl);
      setIsSent(true);
    } else {
      window.open(botUrl, '_blank');
      setIsSent(true);
    }
  };

  const handleContactSeller = () => {
    const tg = (window as any).Telegram?.WebApp;
    if (hasValidSeller && sellerUsername) {
      const sellerUrl = `https://t.me/${sellerUsername}`;
      tg?.openTelegramLink ? tg.openTelegramLink(sellerUrl) : window.open(sellerUrl, '_blank');
    }
  };

  // ФУНКЦИЯ ДЛЯ КНОПКИ ПОДЕЛИТЬСЯ
  const handleShare = () => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg && tg.switchInlineQuery) {
      tg.switchInlineQuery(`share_product_${product.id}`, ['users', 'groups', 'channels']);
    } else {
      console.warn("Telegram WebApp API еще не готов");
    alert("Попробуйте нажать еще раз через секунду, приложение загружается...");
    }
  };

  const formatPostDate = (dateString: string) => {
    try {
      if (!dateString) return "Не указана";
      return new Date(dateString).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) { return "Не указана"; }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-10 px-6 py-4 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Детали товара</h2>
          <div className="flex items-center gap-2">
            <button onClick={onToggleFavorite} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-6">
            <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none" style={{ scrollbarWidth: 'none' }}>
              {product.image.map((imgUrl, index) => (
                <img key={index} src={imgUrl} className="w-full h-full flex-shrink-0 snap-start object-cover" />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-gray-900">{product.title}</h1>
            <p className="text-3xl font-semibold text-gray-900">{product.price_uzs}</p>
            <p className="text-base text-gray-700 leading-relaxed">{product.description}</p>

            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex justify-between"><span className="text-sm text-gray-500">Категория</span><span className="text-sm font-medium text-gray-900">{product.category}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Продавец</span>
                <span className="text-sm font-medium">{hasValidSeller ? <button onClick={handleContactSeller} className="text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-xs font-medium">@{sellerUsername}</button> : "Не указан"}</span>
              </div>
              <div className="flex justify-between items-center"><span className="text-sm text-gray-500">Район</span><span className="text-sm font-medium flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{product.seller_district || "Не указан"}</span></div>
            </div>

            <div className="pt-6 space-y-3">
              <button onClick={handleCalculateTaxi} disabled={isSent} className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 ${isSent ? "bg-green-100 text-green-800" : "bg-yellow-400"}`}>
                {isSent ? "✅ Информация отправлена в чат бота" : "🚕 Рассчитать доставку такси"}
              </button>
              {hasValidSeller ? (
                <button onClick={handleContactSeller} className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" /> Связаться с продавцом
                </button>
              ) : (
                <button disabled className="w-full bg-gray-100 text-gray-400 py-4 rounded-xl font-medium">Контакты не указаны</button>
              )}
              
              {/* НОВАЯ КНОПКА ПОДЕЛИТЬСЯ */}
              <button onClick={handleShare} className="w-full bg-gray-50 text-gray-700 py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
                <Share2 className="w-5 h-5" /> Поделиться
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}