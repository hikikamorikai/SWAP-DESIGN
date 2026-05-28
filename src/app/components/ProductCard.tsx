import { motion } from "motion/react";

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  seller: string;
  channel: string;
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="size-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
          {product.title}
        </h3>
        <p className="text-[10px] text-gray-500 mb-1.5">{product.channel}</p>
        <p className="text-sm font-semibold text-gray-900">{product.price}</p>
      </div>
    </motion.div>
  );
}
