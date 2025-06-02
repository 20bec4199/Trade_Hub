import { useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortOption, setSortOption] = useState('featured');
  const { isAuthenticated, user, logout } = useAuth();

  // Sample product data
  const products = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      category: 'electronics',
      rating: 4.5,
      image: '/placeholder-headphones.jpg'
    },
    {
      id: 2,
      name: 'Organic Cotton T-Shirt',
      price: 29.99,
      category: 'clothing',
      rating: 4.2,
      image: '/placeholder-tshirt.jpg'
    },
    {
      id: 3,
      name: 'Stainless Steel Water Bottle',
      price: 24.95,
      category: 'accessories',
      rating: 4.7,
      image: '/placeholder-bottle.jpg'
    },
    {
      id: 4,
      name: 'Smart Watch',
      price: 199.99,
      category: 'electronics',
      rating: 4.3,
      image: '/placeholder-watch.jpg'
    },
    {
      id: 5,
      name: 'Leather Wallet',
      price: 49.99,
      category: 'accessories',
      rating: 4.1,
      image: '/placeholder-wallet.jpg'
    },
    {
      id: 6,
      name: 'Yoga Mat',
      price: 39.99,
      category: 'fitness',
      rating: 4.4,
      image: '/placeholder-mat.jpg'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'fitness', name: 'Fitness' }
  ]

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory)

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortOption) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation (same as homepage) */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600">
                Trade<span className="text-gray-800">Hub</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
              <Link to="/shop" className="text-indigo-600 font-medium">Shop</Link>
              <Link to="/about" className="text-gray-700 hover:text-indigo-600">About</Link>
              {!isAuthenticated ? (
                <>
                  <button 
                    onClick={() => setShowLogin(true)}
                    className="px-4 py-2 rounded-md text-indigo-600 border border-indigo-600 hover:bg-indigo-50 transition"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => setShowLogin(false)}
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    Register
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user?.name}</span>
                  <button 
                    onClick={logout}
                    className="px-4 py-2 rounded-md text-indigo-600 border border-indigo-600 hover:bg-indigo-50 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            <button className="md:hidden text-gray-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Shop Header */}
      <div className="bg-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Shop Our Collection</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Discover quality products at unbeatable prices. Find exactly what you're looking for.
          </p>
        </div>
      </div>

      {/* Main Shop Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex space-x-2 mb-4 md:mb-0 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  activeCategory === category.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition`}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-gray-600">Sort by:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group">
              <div className="relative bg-gray-200 h-48 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition"></div>
                <span className="text-gray-500">Product Image</span>
                <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50">
              &laquo;
            </button>
            <button className="px-3 py-1 rounded bg-indigo-600 text-white">1</button>
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
              3
            </button>
            <span className="px-2 text-gray-500">...</span>
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
              8
            </button>
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50">
              &raquo;
            </button>
          </nav>
        </div>
      </div>

      {/* Footer (same as homepage) */}
      <footer className="bg-gray-800 text-white py-12">
        {/* Footer content from homepage */}
      </footer>
    </div>
  )
}

export default Shop