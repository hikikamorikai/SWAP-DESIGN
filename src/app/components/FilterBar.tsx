import { useState } from "react";

interface FilterBarProps {
  onApply: (filters: { category: string; priceFrom: string; priceTo: string; size: string }) => void;
}

export function FilterBar({ onApply }: FilterBarProps) {
  const [category, setCategory] = useState("Все");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [size, setSize] = useState("Все");

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Фильтры для iBuyNasvay</h3>
      
      <div className="grid grid-cols-2 gap-2">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
          <option value="Все">Все категории</option>
          <option value="Обувь">Обувь</option>
          <option value="Одежда">Одежда</option>
          <option value="Электроника">Электроника</option>
        </select>

        <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
          <option value="Все">Размер</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>

        <input type="number" placeholder="От (UZS)" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
        <input type="number" placeholder="До (UZS)" value={priceTo} onChange={(e) => setPriceTo(e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
      </div>

      <button 
        onClick={() => onApply({ category, priceFrom, priceTo, size })}
        className="w-full py-2.5 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-all"
      >
        Применить фильтры
      </button>
    </div>
  );
}