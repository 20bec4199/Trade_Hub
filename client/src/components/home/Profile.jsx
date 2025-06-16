import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import userAvatar from '../../assets/images/avatar.jpg';

const Profile = () => {
  const { user, updateUser, isAuthenticated, flag, setFlag,  logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    addresses: user?.addresses || [
      {
        name: '', mobile: '', pincode: '', locality: '', address: '',
        city: '', state: '', landmark: '', alternatePhone: '', addressType: 'home'
      }
    ]
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(userAvatar);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);


  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        addresses: user.addresses?.length ? user.addresses : [{
          name: '', mobile: '', pincode: '', locality: '', address: '',
          city: '', state: '', landmark: '', alternatePhone: '', addressType: 'home'
        }]
      });

      // Handle avatar with cache busting
      if (user.avatar) {
        const isFullUrl = user.avatar.startsWith('http');
        const timestamp = new Date().getTime();
        const avatarUrl = isFullUrl
          ? `${user.avatar.split('?')[0]}?${timestamp}`
          : `http://localhost:8000${user.avatar.split('?')[0]}?${timestamp}`;
        setAvatarPreview(avatarUrl);
      } else {
        setAvatarPreview(userAvatar);
      }
    }
  }, [user]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.match('image.*')) {
      toast.error('Only image files allowed (JPEG, PNG)');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be smaller than 2MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadstart = () => setIsUploadingAvatar(true);
    reader.onload = () => {
      const previewUrl = reader.result;
      setAvatarPreview(previewUrl);
      setIsUploadingAvatar(false);

      // Update context immediately for better UX
      updateUser({ ...user, avatar: previewUrl });
    };
    reader.onerror = () => {
      toast.error('Error reading image file');
      setIsUploadingAvatar(false);
    };
    reader.readAsDataURL(file);

    setAvatarFile(file);

    // Upload to server
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const { data } = await axios.post(
        'http://localhost:8000/api/auth/upload/avatar',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );

      setFlag((prev) => !prev);
      // Update with final server URL
      
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Avatar upload failed');
      // Revert to previous avatar if upload fails
      setAvatarPreview(user.avatar || userAvatar);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddresses = [...formData.addresses];
    updatedAddresses[index][name] = value;
    setFormData({ ...formData, addresses: updatedAddresses });
  };

  const addNewAddress = () => {
    setFormData({
      ...formData,
      addresses: [
        ...formData.addresses,
        {
          name: '', mobile: '', pincode: '', locality: '', address: '',
          city: '', state: '', landmark: '', alternatePhone: '', addressType: 'home'
        }
      ]
    });
  };

  const removeAddress = (index) => {
    if (formData.addresses.length <= 1) return;
    const updatedAddresses = formData.addresses.filter((_, i) => i !== index);
    setFormData({ ...formData, addresses: updatedAddresses });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.put(
        'http://localhost:8000/api/auth/update/user',
        formData,
        { withCredentials: true }
      );

      updateUser(data.user);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setAvatarFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profile update failed');
    } finally {
      setIsLoading(false);
    }
  };
  const handlePushLogin = () => {
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition">
                Trade<span className="text-gray-800">Hub</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-indigo-600 transition">Home</Link>
              <Link to="/shop" className="text-gray-700 hover:text-indigo-600 transition">Shop</Link>
              <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition">About</Link>

              {!isAuthenticated ? (
                <div className="flex space-x-4">
                  <button
                    onClick={handlePushLogin}
                    className="px-4 py-2 rounded-md text-indigo-600 border border-indigo-600 hover:bg-indigo-50 transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handlePushLogin}
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    Register
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <span className="text-gray-700">Hi, {user?.name}</span>
                    <svg
                      className={`h-5 w-5 text-gray-500 transition-transform ${userDropdownOpen ? 'transform rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/cart"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Cart
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md text-indigo-600 border border-indigo-600 hover:bg-indigo-50 transition"
              >
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-500 hover:text-gray-600 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="block px-3 py-2 rounded-md text-base font-medium  text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/cart"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cart
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => {
                      handlePushLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-md text-base font-medium text-indigo-600 border border-indigo-600 hover:bg-indigo-50"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      handlePushLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Profile Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h2 className="text-2xl font-bold text-white">My Profile</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`mt-2 sm:mt-0 px-4 py-2 rounded-md transition ${isEditing
                  ? 'bg-white text-indigo-600 hover:bg-gray-100'
                  : 'bg-indigo-700 text-white hover:bg-indigo-800'}`}
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit}>

              <section className="mb-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Profile Picture
                </h3>

                <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
                  {/* Avatar Preview with Upload Controls */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                      <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${isEditing ? 'border-indigo-200 group-hover:border-indigo-300' : 'border-gray-200'} transition-all duration-200 relative`}>
                        {isUploadingAvatar ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                        ) : (
                          <img
                            src={avatarPreview}
                            alt="User Avatar"
                            className="w-full h-full object-cover"
                            key={user?.avatar || 'default'} // Force re-render on change
                          />
                        )}
                      </div>

                      {isEditing && (
                        <>
                          <button
                            type="button"
                            onClick={triggerFileInput}
                            className="absolute -bottom-2 -right-2 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition shadow-md"
                            title="Change photo"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>
                          <input
                            ref={fileInputRef}
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </>
                      )}
                    </div>

                    {isEditing && avatarFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarFile(null);
                          setAvatarPreview(user?.avatar?.url || '/default-avatar.png');
                        }}
                        className="text-sm text-red-600 hover:text-red-800 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Upload Instructions */}
                  {isEditing && (
                    <div className="flex-1 max-w-md">
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <h4 className="font-medium text-indigo-800 mb-2">Upload Profile Photo</h4>
                        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                          <li>JPG, PNG format (max 2MB)</li>
                          <li>Recommended size: 200×200 pixels</li>
                          <li>Clear, front-facing photo works best</li>
                        </ul>

                        {avatarFile ? (
                          <div className="mt-3 p-2 bg-white rounded border border-indigo-100">
                            <p className="text-indigo-700 text-sm font-medium">
                              Selected: <span className="text-gray-700">{avatarFile.name}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              {(avatarFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={triggerFileInput}
                            className="mt-3 w-full sm:w-auto px-4 py-2 bg-white text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition flex items-center justify-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Choose File
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Personal Information Section */}
              <section className="mb-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                      disabled={!isEditing}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      disabled
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                      disabled={!isEditing}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </section>

              {/* Addresses Section */}
              <section>
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Addresses</h3>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={addNewAddress}
                      className="flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Address
                    </button>
                  )}
                </div>

                {formData.addresses.map((addr, index) => (
                  <div key={index} className="mb-6 p-5 border border-gray-200 rounded-xl bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-700">Address {index + 1}</h4>
                      {isEditing && formData.addresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAddress(index)}
                          className="text-red-600 hover:text-red-800 text-sm flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['name', 'mobile', 'pincode', 'locality', 'address', 'city', 'state', 'landmark', 'alternatePhone'].map((field) => (
                        <div key={`${field}-${index}`} className="mb-3">
                          <label htmlFor={`${field}-${index}`} className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                            {field.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <input
                            id={`${field}-${index}`}
                            type={field === 'mobile' || field === 'alternatePhone' || field === 'pincode' ? 'tel' : 'text'}
                            name={field}
                            value={addr[field]}
                            onChange={(e) => handleAddressChange(index, e)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                            disabled={!isEditing}
                            placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}`}
                          />
                        </div>
                      ))}
                      <div className="mb-3">
                        <label htmlFor={`addressType-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                        <select
                          id={`addressType-${index}`}
                          name="addressType"
                          value={addr.addressType}
                          onChange={(e) => handleAddressChange(index, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                          disabled={!isEditing}
                        >
                          <option value="home">Home</option>
                          <option value="work">Work</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* Submit Button */}
              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center min-w-32"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;