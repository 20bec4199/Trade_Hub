import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

const LoginForm = ({ formValue, handleChangeLogin, handleLogin, toggleAuthMode, error, clearError }) => {
  const [validationErrors, setValidationErrors] = useState({});

  // Define validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clear previous errors
      setValidationErrors({});
      clearError();
      
      // Validate form
      await validationSchema.validate(formValue, { abortEarly: false });
      
      // If validation passes, call the handleLogin function
      await handleLogin(e);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        // Convert Yup errors to object format
        const errors = {};
        err.inner.forEach(error => {
          errors[error.path] = error.message;
        });
        setValidationErrors(errors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Server error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
        
          id="email"
          name="email"
          value={formValue.email}
          onChange={handleChangeLogin}
          className={`w-full px-4 py-2 border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
          onFocus={() => {
            if (validationErrors.email) {
              setValidationErrors(prev => ({ ...prev, email: undefined }));
            }
            clearError();
          }}
        />
        {validationErrors.email && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formValue.password}
          onChange={handleChangeLogin}
          className={`w-full px-4 py-2 border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
          onFocus={() => {
            if (validationErrors.password) {
              setValidationErrors(prev => ({ ...prev, password: undefined }));
            }
            clearError();
          }}
        />
        {validationErrors.password && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
        )}
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            checked={formValue.remember}
            onChange={handleChangeLogin}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
          Forgot password?
        </Link>
      </div>
      
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
      >
        Sign In
      </button>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={toggleAuthMode}
          className="text-indigo-600 hover:text-indigo-500 font-medium"
        >
          Register
        </button>
      </div>
    </form>
  );
};

export default LoginForm;