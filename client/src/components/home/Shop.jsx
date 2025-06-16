import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { get_Products } from '../../services/product/Product';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortOption, setSortOption] = useState('featured');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'fitness', name: 'Fitness' }
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await get_Products();
      
      if (response && response.data.success) {
        if (response.data.product && Array.isArray(response.data.product)) {
          setProducts(response.data.product);
          setProductCount(response.data.count || response.data.product.length);
        } else {
          throw new Error('Products data is not an array');
        }
      } else {
        throw new Error(response?.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products by category
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => {
        return product.category === activeCategory || 
               (product.category?.name === activeCategory);
      });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortOption) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.averageRating - a.averageRating;
      case 'featured':
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePushLogin = () => {
    navigate('/login');
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-lg text-gray-800">Error loading products</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchProducts}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      {/* Shop Header */}
      <div className="bg-indigo-700 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">Shop Our Collection</h1>
          <p className="text-base md:text-xl text-indigo-100 max-w-2xl mx-auto">
            Discover quality products at unbeatable prices. Find exactly what you're looking for.
          </p>
        </div>
      </div>

      {/* Main Shop Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
          <div className="flex space-x-2 mb-4 md:mb-0 overflow-x-auto pb-2 scrollbar-hide w-full md:w-auto">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setCurrentPage(1); // Reset to first page when category changes
                }}
                className={`px-3 py-1 md:px-4 md:py-2 rounded-full whitespace-nowrap text-sm md:text-base ${
                  activeCategory === category.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition`}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className="flex items-center w-full md:w-auto">
            <label htmlFor="sort" className="mr-2 text-gray-600 text-sm md:text-base">Sort by:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setCurrentPage(1); // Reset to first page when sort changes
              }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-auto text-sm md:text-base"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {currentProducts.map(product => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group flex flex-col h-full">
                <div className="relative bg-gray-200 aspect-square flex items-center justify-center overflow-hidden">
                  {product.images?.[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                  ) : (
                    <span className="text-gray-500">No Image Available</span>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition"></div>
                  {product.isFeatured && (
                    <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                  {product.stock <= 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Out of Stock
                    </div>
                  )}
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2 min-h-[2.5rem]">{product.description}</p>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(product.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                      ({product.averageRating?.toFixed(1) || 0})
                      {product.totalReviews > 0 && ` · ${product.totalReviews} reviews`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      {product.discountedPrice && product.discountedPrice < product.price ? (
                        <>
                          <span className="text-lg font-bold text-indigo-600">
                            ${product.discountedPrice.toFixed(2)}
                          </span>
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="ml-2 text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                            {Math.round((1 - product.discountedPrice / product.price) * 100)}% OFF
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button 
                      className={`px-3 py-1 rounded-md text-sm transition ${
                        product.stock > 0 
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={product.stock <= 0}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                  {product.attributes && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {Object.entries(product.attributes).map(([key, value]) => (
                        <span key={key} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-gray-500">
              {activeCategory === 'all' 
                ? "We couldn't find any products matching your criteria." 
                : `No products found in the ${categories.find(c => c.id === activeCategory)?.name} category.`}
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                fetchProducts();
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              View All Products
            </button>
          </div>
        )}

        {/* Pagination */}
        {sortedProducts.length > productsPerPage && (
          <div className="mt-8 md:mt-12 flex justify-center">
            <nav className="flex items-center space-x-1 md:space-x-2">
              <button 
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`px-2 py-1 md:px-3 md:py-1 rounded border border-gray-300 text-sm md:text-base ${
                  currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                &laquo;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-2 py-1 md:px-3 md:py-1 rounded text-sm md:text-base ${
                    currentPage === number 
                      ? 'bg-indigo-600 text-white' 
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {number}
                </button>
              ))}

              <button 
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
                className={`px-2 py-1 md:px-3 md:py-1 rounded border border-gray-300 text-sm md:text-base ${
                  currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                &raquo;
              </button>
            </nav>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Shop;