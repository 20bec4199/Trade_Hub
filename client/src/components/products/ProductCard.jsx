const ProductCard = ({ item }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
        <div className="bg-gray-200 h-48 flex items-center justify-center">
          <span className="text-gray-500">Product Image {item}</span>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1">Product {item}</h3>
          <p className="text-gray-600 mb-2">$19.99</p>
          <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
            Add to Cart
          </button>
        </div>
      </div>
    );
  };
  
  export default ProductCard;