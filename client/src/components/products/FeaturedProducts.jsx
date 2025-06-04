import ProductCard from './ProductCard';

const FeaturedProducts = () => {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <ProductCard key={item} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;