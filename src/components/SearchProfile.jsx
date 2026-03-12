import axios from 'axios';
import { ChevronRight, Languages, Mail, MapPin, Phone } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../config';
import Header from './Header';
import RatingDisplay from './ui/RatingStars';
import ReviewsSection from './ui/ReviewsSection'; // Import the new component

// Gender Icons
const MaleIcon = () => (
  <svg
    className="text-blue-500"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 3h5v5" />
    <path d="m21 3-6.75 6.75" />
    <circle cx="10" cy="14" r="6" />
  </svg>
);

const FemaleIcon = () => (
  <svg
    className="text-pink-500"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="9" r="6" />
    <path d="M12 15v7" />
    <path d="M9 19h6" />
  </svg>
);

// Main Profile Component
const SearchProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const my_id = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchPublicProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${config.backendURL}/api/accounts/profile/${userId}/`,
          {}
        );
        setProfile(response.data);
      } catch (err) {
        setError('Failed to load profile.');
      }
      setLoading(false);
    };
    fetchPublicProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent shadow-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
          <p className="text-red-600 text-center font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header search={true} home={true} login={true} signup={true} />
      {profile && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="relative mb-24 sm:mb-32">
            <div className="h-48 sm:h-64 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-10 pattern-cross-dots-lg"></div>
              <div className="absolute inset-0 flex items-start md:justify-start justify-center p-2">
                <RatingDisplay
                  rating={profile.total_rating}
                  reviewCount={profile.rating_count}
                />
              </div>
            </div>

            {/* Profile Picture */}
            <div className="absolute -bottom-16 sm:-bottom-20 left-1/2 transform -translate-x-1/2 md:left-8 md:transform-none flex flex-col items-center md:items-start">
              <div className="relative">
                <img
                  src={
                    profile.profile_picture || 'https://via.placeholder.com/150'
                  }
                  alt={`${profile.first_name} ${profile.last_name}`}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-emerald-500 rounded-full p-1">
                  <div className="bg-white rounded-full p-1">
                    {profile.gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-4 md:mt-2 text-center md:text-left">
                {profile.first_name} {profile.last_name}
              </h2>
              <p className="text-emerald-600 font-medium">
                @{profile.username}
              </p>
            </div>

            {/* Message Button */}
            <div className="md:hidden absolute right-4 -bottom-16">
              <button
                onClick={() => {
                  my_id
                    ? navigate('/chat', { state: { receiver: profile } })
                    : navigate('/login');
                }}
                className="bg-emerald-500 text-white p-3 rounded-full shadow-lg hover:bg-emerald-600 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Only visible on desktop */}
            <div className="hidden lg:block space-y-4">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="font-semibold text-gray-700 px-4 py-3 border-b bg-gray-50">
                  Menu
                </div>
                <div>
                  <button
                    onClick={() => {
                      my_id
                        ? navigate('/chat', { state: { receiver: profile } })
                        : navigate('/login');
                    }}
                    className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors border-b"
                  >
                    <Mail className="h-5 w-5 mr-3 text-emerald-500" />
                    <span>Message</span>
                    <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Personal Information Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Personal Information
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Full Name
                    </label>
                    <div className="font-medium text-gray-800">
                      {profile.first_name} {profile.last_name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Username
                    </label>
                    <div className="font-medium text-gray-800">
                      @{profile.username}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Email
                    </label>
                    <div className="font-medium text-gray-800 flex items-center">
                      <Mail className="h-4 w-4 text-emerald-500 mr-2" />
                      {profile.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Phone
                    </label>
                    <div className="font-medium text-gray-800 flex items-center">
                      <Phone className="h-4 w-4 text-emerald-500 mr-2" />
                      {profile.phone_number}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Languages
                    </label>
                    <div className="font-medium text-gray-800 flex items-center">
                      <Languages className="h-4 w-4 text-emerald-500 mr-2" />
                      {profile.language || 'English'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Location & Details
                  </h3>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      City
                    </label>
                    <div className="font-medium text-gray-800 flex items-start">
                      <MapPin className="h-4 w-4 text-emerald-500 mr-2 mt-1 flex-shrink-0" />
                      <span>{profile.city}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section - Added here */}
              <ReviewsSection userId={userId} />
            </div>
          </div>
        </div>
      )}
      {/* Add padding at the bottom when bottom navbar is visible */}
      <div className="md:hidden h-16"></div>
    </div>
  );
};

export default SearchProfile;
