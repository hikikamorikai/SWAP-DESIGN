import { motion } from "motion/react";
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

  if (!product) return null;

  const handleCalculateTaxi = () => {
    const tg = (window as any).Telegram?.WebApp;
    const botUrl = `https://t.me/nearbytashkent_bot?start=calc_taxi_${product.id}`;
    
    if (tg && tg.openTelegramLink) {
      // 1. Сразу даем вибро-отклик в палец
      tg.HapticFeedback.impactOccurred('medium');
      
      // 2. СНАЧАЛА вызываем нативное окно (до перехода и закрытия)
      if (tg.showPopup) {
        tg.showPopup({
          title: "🚕 Расчет отправлен!",
          message: "Сравнение цен на доставку по Ташкенту уже ждет тебя в чате с ботом.",
          buttons: [{ type: "ok", text: "Отлично" }]
        });
      }
      
      // 3. ТЕПЕРЬ открываем диплинк для бэкенда
      tg.openTelegramLink(botUrl);
      
      // 4. Мягко пытаемся закрыть Mini App через 500мс (даем время окну отрисоваться)
      setTimeout(() => { 
        tg.close(); 
      }, 500);
    } else {
      // Железный фолбек для обычных браузеров на ПК
      window.open(botUrl, '_blank');
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
  );
}
