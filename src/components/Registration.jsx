import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import Header from './Header';
import FileUpload from './ui/FileUpload';
import { isInFormat } from './utils/FormatCheck';

const Registration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    dob: '',
    gender: '',
    language: '',
    address: '',
    city: '',
    pincode: '',
    emergency_email: '',
    profile: '',
    license: '',
    idCard: '',
    tAndC: false,
    info: false,
  });
  const [valid, setValid] = useState({
    username: null,
    email: null,
    phone: null,
  });

  // State to manage modal visibility
  const [isModalOpen, setModalOpen] = useState(false);

  function handleModel() {
    setModalOpen(!isModalOpen);
  }

  async function handleChange(e) {
    const { name, value, type } = e.target;
    setUserData({
      ...userData,
      [name]: type === 'checkbox' ? e.target.checked : value,
    });

    if (name in valid && value.length > 0) {
      try {
        const response = await axios.get(
          `${config.backendURL}/api/accounts/check-value/`,
          {
            params: { name: name, value: value }
          }
        );
        if (response.data.is_available && isInFormat(name, value)) {
          setValid({
            ...valid,
            [name]: true,
          });
        } else {
          setValid({
            ...valid,
            [name]: false,
          });
        }
      } catch (error) {
        console.error('Failed to check username availability', error);
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    if (userData.password === userData.confirmPassword) {
      console.log('User data', userData);
    } else {
      alert('Password and confirm password do not match');
    }

    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('first_name', userData.firstName);
    formData.append('last_name', userData.lastName);
    formData.append('phone_number', userData.phone);
    formData.append('dob', userData.dob);
    formData.append('gender', userData.gender);
    formData.append('language', userData.language);
    formData.append('address', userData.address);
    formData.append('city', userData.city);
    formData.append('pincode', userData.pincode);
    formData.append('emergency_email', userData.emergency_email);

    if (userData.profile) {
      formData.append('profile_picture', userData.profile);
    }
    if (userData.license) {
      formData.append('drivers_license', userData.license);
    }
    if (userData.idCard) {
      formData.append('identity_card', userData.idCard);
    }

    const apiUrl = `${config.backendURL}/api/accounts/register/`;

    axios
      .post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('Registration successful', response);
        // Handle further actions after successful registration like redirecting to login or home page
        navigate('/login');
      })
      .catch((error) => {
        console.error('Registration failed', error.response);
        // Handle errors here, such as displaying a notification to the user
      });
    setIsLoading(false);
  }

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const renderModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-5 rounded-lg max-w-lg w-full">
          <h2 className="text-xl font-bold">
            Terms of Service and Privacy Policy
          </h2>
          <p className="my-4">
            Here are the terms and conditions and privacy policy for your
            account. Make sure you read them carefully. Include your terms and
            privacy policy text here.
          </p>
          <button
            onClick={handleModel}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const renderProgressBar = () => (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="text-sm font-medium">
            Step {i + 1}
          </div>
        ))}
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-[#019863] rounded-full transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Account Information</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Username</label>
          <input
            onChange={handleChange}
            value={userData.username}
            name="username"
            type="text"
            className={`w-full p-3 border rounded-lg focus:ring-2 ${
              valid.username === true
                ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                : valid.username === false
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            onChange={handleChange}
            value={userData.email}
            name="email"
            type="email"
            className={`w-full p-3 border rounded-lg focus:ring-2 ${
              valid.email === true
                ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                : valid.email === false
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <input
            onChange={handleChange}
            value={userData.password}
            name="password"
            type="password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Create a password"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm Password</label>
          <input
            onChange={handleChange}
            value={userData.confirmPassword}
            name="confirmPassword"
            type="password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Confirm your password"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Personal Information</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">First Name</label>
          <input
            onChange={handleChange}
            value={userData.firstName}
            name="firstName"
            type="text"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter your first name"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Last Name</label>
          <input
            onChange={handleChange}
            value={userData.lastName}
            name="lastName"
            type="text"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter your last name"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <input
            onChange={handleChange}
            value={userData.phone}
            name="phone"
            type="tel"
            className={`w-full p-3 border rounded-lg focus:ring-2 ${
              valid.phone === true
                ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                : valid.phone === false
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="Enter your phone number"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Date of Birth</label>
          <input
            onChange={handleChange}
            value={userData.dob}
            name="dob"
            type="date"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Gender</label>
          <select
            onChange={handleChange}
            value={userData.gender}
            name="gender"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Preferred Language</label>
          <select
            onChange={handleChange}
            value={userData.language}
            name="language"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Select language</option>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="malayalam">Malayalam</option>
            <option value="tamil">Tamil</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Location & Preferences</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 space-y-2">
          <label className="text-sm font-medium">Home Address</label>
          <textarea
            onChange={handleChange}
            value={userData.address}
            name="address"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            rows="3"
            placeholder="Enter your home address"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">City</label>
          <input
            onChange={handleChange}
            value={userData.city}
            name="city"
            type="text"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter your city"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Postal Code</label>
          <input
            onChange={handleChange}
            value={userData.pincode}
            name="pincode"
            type="text"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter postal code"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Communication Preferences
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded text-emerald-500" />
              <span className="text-sm">
                Email notifications for new ride matches
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded text-emerald-500" />
              <span className="text-sm">
                SMS notifications for ride updates
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded text-emerald-500" />
              <span className="text-sm">Weekly ride summary emails</span>
            </label>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Emergency Email</label>
          <input
            onChange={handleChange}
            value={userData.emergency_email}
            name="emergency_email"
            type="email"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter emergency email"
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Document Verification</h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <FileUpload
            label="Profile Picture"
            updateFilesCb={(file) =>
              setUserData({ ...userData, profile: file })
            }
          />
        </div>

        <div className="space-y-2">
          <FileUpload
            label="Driver's License"
            updateFilesCb={(file) =>
              setUserData({ ...userData, license: file })
            }
          />
        </div>

        <div className="space-y-2">
          <FileUpload
            label="Government ID"
            updateFilesCb={(file) => setUserData({ ...userData, idCard: file })}
          />
        </div>

        <div className="col-span-2 space-y-2">
          <label className="text-sm font-medium">Terms and Conditions</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                onChange={handleChange}
                name="tAndC"
                checked={userData.tAndC}
                type="checkbox"
                className="rounded text-emerald-500"
                required
              />
              <span className="text-sm">
                I agree to the{' '}
                <span
                  onClick={handleModel}
                  className="cursor-pointer text-emerald-500 hover:underline"
                >
                  Terms of Service and Privacy Policy
                </span>
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                onChange={handleChange}
                name="info"
                checked={userData.info}
                required
                className="rounded text-emerald-500"
              />
              <span className="text-sm">
                I confirm that all provided information is accurate
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header search={false} home={true} login={true} signup={false} />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Create your RideLync Account
            </h1>
            <p className="mt-2 text-gray-600">
              Join our community of riders and drivers
            </p>
          </div>
          {renderModal()} {/* Invoke the modal render method */}
          {renderProgressBar()}
          <form className="space-y-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            <div className="flex justify-between pt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </button>
              )}

              <button
                type="button"
                onClick={(event) => {
                  if (step === totalSteps) {
                    handleSubmit(event);
                  } else {
                    setStep(step + 1);
                  }
                }}
                className="ml-auto px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-[#019863]"
              >
                {step === totalSteps ? (
                  isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                    'Create Account'
                  )
                ) : (
                  'Next'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Registration;
