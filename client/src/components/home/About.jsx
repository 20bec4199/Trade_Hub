import { Link } from 'react-router-dom'

const About = () => {
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
              <Link to="/shop" className="text-gray-700 hover:text-indigo-600">Shop</Link>
              <Link to="/about" className="text-indigo-600 font-medium">About</Link>
              <Link to="/login" className="px-4 py-2 rounded-md text-indigo-600 border border-indigo-600 hover:bg-indigo-50 transition">
                Sign In
              </Link>
            </div>
            <button className="md:hidden text-gray-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* About Header */}
      <div className="bg-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">About TradeHub</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Our story, mission, and the values that drive us to deliver exceptional shopping experiences.
          </p>
        </div>
      </div>

      {/* Main About Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2023, TradeHub began as a small startup with a big vision: to create an e-commerce platform that prioritizes quality, affordability, and customer satisfaction above all else.
            </p>
            <p className="text-gray-600 mb-4">
              What started as a team of three passionate individuals has grown into a thriving online marketplace serving thousands of customers worldwide.
            </p>
            <p className="text-gray-600">
              Today, we're proud to offer a curated selection of products from trusted brands and emerging artisans alike.
            </p>
          </div>
          <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
            <span className="text-gray-500">Our Team Photo</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-last lg:order-first">
            <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
              <span className="text-gray-500">Our Warehouse</span>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              At TradeHub, we believe that everyone deserves access to high-quality products at fair prices. We're committed to:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">Providing exceptional customer service</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">Supporting ethical and sustainable businesses</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">Offering competitive prices without compromising quality</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">Creating a seamless online shopping experience</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Alex Johnson', role: 'Founder & CEO', bio: 'Visionary leader with 10+ years in e-commerce' },
              { name: 'Sarah Chen', role: 'Head of Operations', bio: 'Supply chain expert and logistics wizard' },
              { name: 'Michael Rodriguez', role: 'Marketing Director', bio: 'Digital marketing strategist and brand builder' },
              { name: 'Emily Wilson', role: 'Customer Experience', bio: 'Dedicated to making every customer feel valued' }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <span className="text-gray-500">Team Member Photo</span>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-indigo-600 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-indigo-50 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Integrity', icon: '👔', description: 'We conduct business with honesty and transparency in all our dealings.' },
              { title: 'Innovation', icon: '💡', description: 'We constantly seek new ways to improve and enhance your shopping experience.' },
              { title: 'Community', icon: '🤝', description: 'We believe in building strong relationships with customers and partners.' }
            ].map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer (same as homepage) */}
      <footer className="bg-gray-800 text-white py-12">
        {/* Footer content from homepage */}
      </footer>
    </div>
  )
}

export default About