import axios from 'axios';
import { AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import Header from './Header';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = () => navigate('/signup');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${config.backendURL}/api/accounts/login/`,
        credentials
      );

      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('fullName', response.data.fullname);
      localStorage.setItem('user_id', response.data.user_id);

      console.log('Login Successful!');
      navigate('/');
    } catch (error) {
      console.error('Login Failed!', error);
      if (error.response) {
        // Handle specific error messages from the backend
        if (error.response.status === 401) {
          setError('Invalid username or password');
        } else if (error.response.status === 404) {
          setError('User not found');
        } else if (error.response.data?.message) {
          setError(error.response.data.message);
        } else {
          setError('Login failed. Please try again.');
        }
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header search={false} home={true} login={false} signup={true} />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-gray-600">Log in to RideLync</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter your password"
                required
              />
              <p className="text-sm text-gray-600">
                <span
                  onClick={() => navigate('/forgot')}
                  className="text-gray-500 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </span>
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-[#019863] flex items-center justify-center"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : (
                  'Log In'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <span
                  onClick={handleSignUp}
                  className="text-emerald-500 hover:underline cursor-pointer"
                >
                  Sign Up
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
