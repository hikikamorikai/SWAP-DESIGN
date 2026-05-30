import { useState } from "react";

export function FilterBar({ onApply }: any) {
  const [category, setCategory] = useState("Все");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [size, setSize] = useState("Все");

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Фильтры</h3>
      <div className="grid grid-cols-2 gap-2">
        {/* Категории */}
        <select onChange={(e) => setCategory(e.target.value)} className="p-2 bg-gray-50 border rounded-lg text-sm">
          <option value="Все">Все категории</option>
          <option value="Одежда">Одежда</option>
          <option value="Обувь">Обувь</option>
          <option value="Аксессуары">Аксессуары</option>
        </select>

        {/* Размеры (XS, S, M, L, XL, XXL) */}
        <select onChange={(e) => setSize(e.target.value)} className="p-2 bg-gray-50 border rounded-lg text-sm">
          <option value="Все">Размер</option>
          <option value="XXS">XXS</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
          <option value="XXXL">XXXL</option>
        </select>

        {/* Цены */}
        <input type="number" placeholder="От (UZS)" onChange={(e) => setPriceFrom(e.target.value)} className="p-2 bg-gray-50 border rounded-lg text-sm" />
        <input type="number" placeholder="До (UZS)" onChange={(e) => setPriceTo(e.target.value)} className="p-2 bg-gray-50 border rounded-lg text-sm" />
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