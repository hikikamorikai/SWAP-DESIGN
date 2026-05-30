import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, MessageCircle, ExternalLink, User, MapPin } from "lucide-react"; // Добавил MapPin для района

interface Product {
  id: number;
  title: string;
  price_uzs: string;       // Обновили поле цены
  image: string[];
  seller: string;          // Наше динамическое поле продавца
  seller_district: string; // Новое поле района из бэкенда
  channel: string;
  description: string;
  category: string;
  date: string;
}

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetail({ product, onClose }: ProductDetailProps) {
  const [isSent, setIsSent] = useState(false);

  // Сбрасываем статус кнопки в обычный режим, если юзер переключился на другой товар
  useEffect(() => {
    setIsSent(false);
  }, [product?.id]);

  if (!product) return null;

  const handleCalculateTaxi = () => {
    if (isSent) return;
  
    const tg = (window as any).Telegram?.WebApp;
    const botUrl = `https://t.me/nearbytashkent_bot?start=calc_taxi_${product.id}`;
    
    if (tg) {
      // 1. ЗАПУСКАЕМ ВИБРАЦИЮ (Сработает мгновенно при тапе)
      if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
      }
      
      // 2. Показываем поп-ап
      if (tg.showPopup) {
        tg.showPopup({
          title: '🚕 Расчет отправлен!',
          message: 'Сравнение цен на доставку по Ташкенту уже ждет тебя в чате с ботом. Проверь переписку!',
          buttons: [{ type: 'close', text: 'Понятно' }]
        });
      }
        
      if (tg.openTelegramLink) {
        tg.openTelegramLink(botUrl);
      }
  
      setIsSent(true);
    } else {
      window.open(botUrl, '_blank');
      setIsSent(true);
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
                {product.price_uzs} {/* Выводим новую цену price_uzs */}
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

              {/* УМНАЯ АВТОМАТИЧЕСКАЯ СТРОКА С ПРОДАВЦОМ */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Продавец</span>
                <span className="text-sm font-medium text-gray-900">
                  {product.seller && product.seller.startsWith('@') ? (
                    <a 
                      href={`https://t.me/${product.seller.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 bg-blue-5 px-2.5 py-1 rounded-lg text-xs"
                    >
                      <User className="w-3.5 h-3.5" />
                      {product.seller}
                    </a>
                  ) : (
                    product.seller || "Не указан"
                  )}
                </span>
              </div>

              {/* НОВАЯ СТРОКА: РАЙОН ПРОДАВЦА */}
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

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Канал</span>
                <span className="text-sm font-medium text-blue-600">
                  {product.channel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Дата публикации</span>
                <span className="text-sm font-medium text-gray-900">
                  {product.date}
                </span>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="pt-6 space-y-3">
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

              <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                <MessageCircle className="w-5 h-5" />
                Связаться с продавцом
              </button>
              
              <button className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                <ExternalLink className="w-5 h-5" />
                Открыть в канале
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}