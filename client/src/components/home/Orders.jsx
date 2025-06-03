import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Orders = () => {
    const { user, updateUser, isAuthenticated, logout } = useAuth();
  const [orders, setOrders] = useState([
    {
        "_id": "order123",
        "createdAt": "2023-07-20T12:00:00Z",
        "orderStatus": "Processing",
        "totalPrice": 1999,
        "orderItems": [
          {
            "_id": "item1",
            "name": "Product 1",
            "quantity": 1,
            "image": "/product1.jpg",
            "price": 999
          },
          {
            "_id": "item2",
            "name": "Product 2",
            "quantity": 2,
            "image": "/product2.jpg",
            "price": 500
          }
        ]
      }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders/myorders');
        // Make sure data.orders exists and is an array
        // if (data && Array.isArray(data.orders)) {
        //   setOrders(data.orders);
        // } else {
        //   setOrders([]); // Set to empty array if data structure is unexpected
        //   console.warn('Unexpected API response structure:', data);
        // }
      } catch (err) {
        setError(err);
        toast.error(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900">Error loading orders</h2>
          <p className="mt-2 text-gray-600">
            {error.message || 'An error occurred while loading your orders.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
            <Link to="/shop" className="text-gray-700 hover:text-indigo-600">Shop</Link>
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
              <div className="relative group">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <span className="text-gray-700">Hi, {user?.name}</span>
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">My Orders</Link>
                  <Link to="/cart" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">Cart</Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
             <button 
                    onClick={logout}
                    className="px-4 py-2 rounded-md text-indigo-600 border border-indigo-600 hover:bg-indigo-50 transition"
                  >
                    Logout
                  </button>
          </div>
          <button className="md:hidden text-gray-500">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
      <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
          </div>
          
          <div className="p-6">
            {orders && orders.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
                <p className="mt-1 text-gray-500">
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
                <div className="mt-6">
                  <Link
                    to="/shop"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Start Shopping
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Order #{order._id.substring(0, 8).toUpperCase()}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.orderStatus === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {order.orderItems.slice(0, 3).map((item) => (
                          <div key={item._id} className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16">
                              <img
                                className="h-full w-full object-contain"
                                src={item.image}
                                alt={item.name}
                              />
                            </div>
                            <div className="ml-4">
                              <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.orderItems.length > 3 && (
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-500">
                                +{order.orderItems.length - 3} more
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                        </p>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ₹{order.totalPrice.toLocaleString('en-IN')}
                          </p>
                          <Link
                            to={`/order/${order._id}`}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            View details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;