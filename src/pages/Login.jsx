import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validation } from '../api/auth';

const Login = ({ onSuccess, onSwitchToRegister }) => {
  const { login, loginLoading, error, clearError, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (error) clearError();
    setFormErrors({});
    setSuccessMessage('');
  }, [formData.email, formData.password]);

  useEffect(() => {
    if (isAuthenticated && onSuccess) onSuccess();
  }, [isAuthenticated, onSuccess]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setSuccessMessage('');

    const validation_result = validation.validateLogin(formData);
    if (!validation_result.isValid) {
      setFormErrors(validation_result.errors);
      return;
    }

    const result = await login(formData);
    if (result.success) {
      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => { if (onSuccess) onSuccess(); }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to HOLO
          </h2>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="rounded-md bg-green-50 p-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <p className="ml-3 text-sm text-green-800">{successMessage}</p>
          </div>
        )}
        {error && (
          <div className="rounded-md bg-red-50 p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${formErrors.email ? 'border-red-300' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                disabled={loginLoading}
              />
              {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Passwordg</label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-2 pr-10 border ${formErrors.password ? 'border-red-300' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  disabled={loginLoading}
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)} disabled={loginLoading}>
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loginLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loginLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign in'}
            </button>
          </div>

          <div className="text-sm text-center">
            <button type="button" onClick={onSwitchToRegister} className="font-medium text-blue-600 hover:text-blue-500">
              Don't have an account? Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
