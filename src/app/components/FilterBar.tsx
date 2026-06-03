import { useState, useEffect } from "react";

export function FilterBar({ onApply, activeFilters }: any) {
  const [category, setCategory] = useState(activeFilters.category);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [size, setSize] = useState(activeFilters.size);

  useEffect(() => {
    setCategory(activeFilters.category);
    setPriceFrom(activeFilters.priceFrom);
    setPriceTo(activeFilters.priceTo);
    setSize(activeFilters.size);
  }, [activeFilters]);

  // Массивы размеров
  const clothingSizes = ["o/s", "XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const shoeSizes = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

  // Выбираем список размеров в зависимости от категории
  const currentSizes = category === "Обувь" ? shoeSizes : clothingSizes;

  // Обработчик смены категории
  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setSize("Все"); // Сбрасываем размер при смене категории
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Фильтры</h3>
      <div className="grid grid-cols-2 gap-2">
        
        {/* Категории */}
        <select 
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)} 
          className="p-2 bg-gray-50 border rounded-lg text-sm"
        >
          <option value="Все">Все категории</option>
          <option value="Одежда">Одежда</option>
          <option value="Обувь">Обувь</option>
          <option value="Аксессуары">Аксессуары</option>
        </select>

        {/* Динамические размеры */}
        <select 
          value={size} 
          onChange={(e) => setSize(e.target.value)} 
          className="p-2 bg-gray-50 border rounded-lg text-sm"
        >
          <option value="Все">Размер</option>
          {currentSizes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Цены */}
        <input 
          type="number" 
          placeholder="От (UZS)" 
          value={priceFrom}
          onChange={(e) => setPriceFrom(e.target.value)} 
          className="p-2 bg-gray-50 border rounded-lg text-sm" 
        />
        <input 
          type="number" 
          placeholder="До (UZS)" 
          value={priceTo}
          onChange={(e) => setPriceTo(e.target.value)} 
          className="p-2 bg-gray-50 border rounded-lg text-sm" 
        />
      </div>
      
      <button 
        onClick={() => onApply({ category, priceFrom, priceTo, size })} 
        className="w-full py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all"
      >
        Применить фильтры
      </button>
    </div>
  );
}