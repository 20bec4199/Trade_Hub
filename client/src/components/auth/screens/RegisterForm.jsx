import { useState } from 'react';
import * as Yup from 'yup';

const RegisterForm = ({ formData, handleChange, handleSubmit, toggleAuthMode, error, clearError }) => {
  const [validationErrors, setValidationErrors] = useState({});

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .max(30, 'Name do not exceeds 30 characters')
      .required('Name is required!'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleSubmit1 = async (e) => {
    e.preventDefault();
    try {
      setValidationErrors({});
      clearError();

      await validationSchema.validate(formData, { abortEarly: false });

      await handleSubmit(e);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = {};
        err.inner.forEach(error => {
          errors[error.path] = error.message;
        });
        setValidationErrors(errors);
      }
    }
  }
  return (
    <form onSubmit={handleSubmit1}>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}

          onFocus={() => {
            if (validationErrors.name) {
              setValidationErrors(prev => ({ ...prev, name: undefined }));
            }
            clearError();
          }}
        />
        {validationErrors.name && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}

          onFocus={() => {
            if (validationErrors.email) {
              setValidationErrors((prev) => ({ ...prev, email: undefined }));
            }
            clearError();
          }}
        />
        {validationErrors.email && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
        )}
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-2 border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
         
          onFocus={() => {
            if (validationErrors.password) {
              setValidationErrors((prev) => ({ ...prev, password: undefined }));
            }
            clearError();
          }}
        />
        {validationErrors.password && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
      >
        Create Account
      </button>
      <div className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={toggleAuthMode}
          className="text-indigo-600 hover:text-indigo-500 font-medium"
        >
          Sign In
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;