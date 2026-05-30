import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, ExternalLink } from "lucide-react";

interface Product {
  id: number;
  title: string;
  price: string;
  image: string[];
  seller: string;
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
  // Состояние для отображения нашего верхнего уведомления
  const [showTaxiToast, setShowTaxiToast] = useState(false);

  if (!product) return null;

  const handleCalculateTaxi = () => {
    const tg = (window as any).Telegram?.WebApp;
    const botUrl = `https://t.me/nearbytashkent_bot?start=calc_taxi_${product.id}`;
    
    if (tg && tg.openTelegramLink) {
      // 1. Сразу даем вибро-отклик в палец
      tg.HapticFeedback.impactOccurred('medium');
      
      // 2. Открываем диплинк для бэкенда
      tg.openTelegramLink(botUrl);
      
      // 3. Включаем наше уведомление на самом первом плане
      setShowTaxiToast(true);
      
      // Автоматически скрываем уведомление через 4 секунды
      setTimeout(() => {
        setShowTaxiToast(false);
      }, 4000);
    } else {
      // Железный фолбек для обычных браузеров на ПК
      window.open(botUrl, '_blank');
    }
  };

  return (
    <>
      {/* АНИМАЦИЯ НАШЕГО УВЕДОМЛЕНИЯ (Вынесено на супер-первый план z-[60]) */}
      <AnimatePresence>
        {showTaxiToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-x-4 top-4 z-[60] bg-gray-900 text-white p-4 rounded-2xl shadow-2xl border border-gray-800"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚕</span>
              <div>
                <h4 className="font-bold text-sm text-yellow-400">Расчет отправлен!</h4>
                <p className="text-xs text-gray-300 mt-0.5 leading-normal">
                  Сравнение цен на доставку по Ташкенту уже отправлено в твой чат с ботом.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Основная модалка детализации товара */}
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
          {/* Шапка модалки с кнопкой закрытия */}
          <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-10 px-6 py-4 flex justify-between items-center border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Детали товара</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Главный контейнер с контентом */}
          <div className="p-6">
            
            {/* ГАЛЕРЕЯ КАРТИНОК С ФУНКЦИЕЙ СВАЙПА */}
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
                  {product.price}
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
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Продавец</span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.seller}
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
                {/* Кнопка такси */}
                <button 
                  onClick={handleCalculateTaxi}
                  className="w-full bg-yellow-400 text-gray-950 py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors shadow-sm"
                >
                  <span>🚕</span>
                  Рассчитать доставку такси
                </button>

                {/* Кнопка связаться */}
                <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  Связаться с продавцом
                </button>
                
                {/* Кнопка открыть в канале */}
                <button className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                  <ExternalLink className="w-5 h-5" />
                  Открыть в канале
                </button>
              </div>

            </div> {/* Конец div.space-y-4 */}
          </div> {/* Конец div.p-6 */}
        </motion.div>
      </motion.div>
    </>
  );
}