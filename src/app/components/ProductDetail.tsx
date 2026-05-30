import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, MessageCircle, ExternalLink, User, MapPin, Calendar } from "lucide-react";

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
}

export function ProductDetail({ product, onClose }: ProductDetailProps) {
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    setIsSent(false);
  }, [product?.id]);

  if (!product) return null;

  // Функция валидации продавца (вынесли вверх, чтобы использовать и в кнопках, и в верстке)
  const getValidSellerUsername = () => {
    const rawSeller = product.seller || "";
    // Убираем собачки и пробелы
    const cleanUsername = rawSeller.replace(/[@\s]/g, ''); 
    
    // Проверяем, чтобы это не был мусор из базы
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

  // 1. КНОПКА ТАКСИ
  const handleCalculateTaxi = () => {
    if (isSent) return;

    const tg = (window as any).Telegram?.WebApp;
    const botUrl = `https://t.me/nearbytashkent_bot?start=calc_taxi_${product.id}`;
    
    if (tg) {
      if (tg.ready) tg.ready();

      if (tg.HapticFeedback && tg.HapticFeedback.impactOccurred) {
        tg.HapticFeedback.impactOccurred('heavy'); 
      } else if (navigator.vibrate) {
        navigator.vibrate(100);
      }
      
      if (tg.showPopup) {
        tg.showPopup({
          title: '🚕 Расчет отправлен!',
          message: 'Сравнение цен на доставку по Ташкенту уже ждет тебя в чате с ботом.',
          buttons: [{ type: 'close', text: 'Понятно' }]
        });
      }
        
      if (tg.openTelegramLink) {
        tg.openTelegramLink(botUrl);
      }

      setIsSent(true);
    } else {
      if (navigator.vibrate) navigator.vibrate(100);
      window.open(botUrl, '_blank');
      setIsSent(true);
    }
  };

  // 2. ИСПРАВЛЕННАЯ ФУНКЦИЯ СВЯЗИ (По промпту бэкендщика 🚀)
  const handleContactSeller = () => {
    const tg = (window as any).Telegram?.WebApp;
    
    if (hasValidSeller && sellerUsername) {
      const sellerUrl = `https://t.me/${sellerUsername}`;

      if (tg && tg.openTelegramLink) {
        tg.openTelegramLink(sellerUrl);
      } else {
        window.open(sellerUrl, '_blank');
      }
    } else {
      if (tg && tg.showPopup) {
        tg.showPopup({ 
          title: 'Упс!',
          message: 'К сожалению, у этого товара нет прямого контакта продавца.' 
        });
      } else {
        alert('К сожалению, у этого товара нет прямого контакта продавца.');
      }
    }
  };

  // 3. ОТКРЫТЬ В КАНАЛЕ
  const handleOpenInChannel = () => {
    const tg = (window as any).Telegram?.WebApp;
    
    if (product.channel_username && product.telegram_post_id) {
      const cleanChannel = product.channel_username.replace('@', '').trim();
      const channelUrl = `https://t.me/${cleanChannel}/${product.telegram_post_id}`;
      
      if (tg && tg.openLink) {
        tg.openLink(channelUrl); 
      } else {
        window.open(channelUrl, '_blank');
      }
    } else {
      if (tg && tg.showPopup) {
        tg.showPopup({ message: 'Ссылка на оригинальный пост недоступна.' });
      } else {
        alert('Ссылка на оригинальный пост недоступна.');
      }
    }
  };

  const formatPostDate = (dateString: string) => {
    try {
      if (!dateString) return "Не указана";
      return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return "Не указана";
    }
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
        {/* Шапка модалки */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-10 px-6 py-4 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Детали товара</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Главный контейнер */}
        <div className="p-6">
          
          {/* ГАЛЕРЕЯ КАРТИНОК */}
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-6 relative">
            <div 
              className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
              style={{ scrollbarWidth: 'none' }}
            >
              {product.image && product.image.length > 0 ? (
                product.image.map((imgUrl, index) => (
                  <div key={index} className="w-full h-full flex-shrink-0 snap-start select-none">
                    <img
                      src={imgUrl}
                      alt={`${product.title} - фото ${index + 1}`}
                      className="w-full h-full object-cover"
                      draggable="false"
                    />
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  Нет фото
                </div>
              )}
            </div>
          </div>

          {/* Информационный блок */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {product.title}
              </h1>
              <p className="text-3xl font-semibold text-gray-900">
                {product.price_uzs}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-base text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Характеристики */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Категория</span>
                <span className="text-sm font-medium text-gray-900">
                  {product.category}
                </span>
              </div>

              {/* ИСПРАВЛЕННЫЙ РЕНДЕР ПРОДАВЦА */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Продавец</span>
                <span className="text-sm font-medium text-gray-900">
                  {hasValidSeller ? (
                    <button 
                      onClick={handleContactSeller}
                      className="text-blue-600 hover:underline flex items-center gap-1 bg-blue-5 px-2.5 py-1 rounded-lg text-xs font-medium"
                    >
                      <User className="w-3.5 h-3.5" />
                      @{sellerUsername}
                    </button>
                  ) : (
                    "Не указан"
                  )}
                </span>
              </div>

              {/* РАЙОН */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Район</span>
                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  {product.seller_district ? (
                    <>
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {product.seller_district}
                    </>
                  ) : (
                    "Не указан"
                  )}
                </span>
              </div>

              {/* ДАТА */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Дата публикации</span>
                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {formatPostDate(product.created_at)}
                </span>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="pt-6 space-y-3">
              {/* КНОПКА ТАКСИ */}
              <button 
                onClick={handleCalculateTaxi}
                disabled={isSent}
                className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-sm ${
                  isSent 
                    ? "bg-green-100 text-green-800 border border-green-200 cursor-not-allowed" 
                    : "bg-yellow-400 text-gray-950 hover:bg-yellow-500"
                }`}
              >
                {isSent ? (
                  <>
                    <span>✅</span>
                    Информация отправлена в чат
                  </>
                ) : (
                  <>
                    <span>🚕</span>
                    Рассчитать доставку такси
                  </>
                )}
              </button>

              {/* УМНАЯ КНОПКА СВЯЗИ */}
              {hasValidSeller ? (
                <button 
                  onClick={handleContactSeller}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  Связаться с продавцом
                </button>
              ) : (
                <button 
                  disabled
                  className="w-full bg-gray-100 text-gray-400 py-4 rounded-xl font-medium flex items-center justify-center gap-2 cursor-not-allowed border border-gray-200/50"
                >
                  <MessageCircle className="w-5 h-5 text-gray-300" />
                  Контакты не указаны в посте
                </button>
              )}
              
              {/* КНОПКА ОТКРЫТЬ В КАНАЛЕ */}
              <button 
                onClick={handleOpenInChannel}
                className="w-full bg-gray-50 text-gray-700 py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-gray-500" />
                Открыть в канале
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}