import axios from 'axios';
import { AlertCircle, ArrowRight, KeyRound, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import config from '../config';
import Header from './Header';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSendOTP = async () => {
    if (!validateEmail(email)) return;

    try {
      setLoading(true);
      setError('');
      await axios.post(`${config.backendURL}/api/accounts/send-otp/`, {
        email,
      });
      setStep(2);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No account found with this email');
      } else {
        setError('Unable to send OTP. Please try again later');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await axios.post(`${config.backendURL}/api/accounts/verify-otp/`, {
        email,
        otp,
      });
      setStep(3);
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Invalid OTP. Please check and try again');
      } else {
        setError('Verification failed. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) return;

    try {
      setLoading(true);
      setError('');
      await axios.post(`${config.backendURL}/api/accounts/reset-password/`, {
        email,
        new_password: newPassword,
      });
      window.location.href = '/login';
    } catch (err) {
      setError('Password reset failed. Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header search={false} login={true} signup={true} home={false} />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center">
                  <div
                    className={`rounded-full h-8 w-8 flex items-center justify-center ${
                      step >= item ? 'bg-emerald-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {item}
                  </div>
                  {item < 3 && (
                    <ArrowRight
                      className={`h-4 w-4 mx-2 ${
                        step > item ? 'text-emerald-600' : 'text-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Enter OTP
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyRound className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        setError('');
                      }}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      placeholder="Enter OTP"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Please check your email for the OTP
                  </p>
                </div>

                <button
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError('');
                      }}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError('');
                      }}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
