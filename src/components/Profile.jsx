import axios from 'axios';
import {
  Calendar,
  Car,
  ChevronRight,
  Languages,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Shield,
  Trash2,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import EditProfileModal from './EditProfileModal';
import Header from './Header';
import RatingDisplay from './ui/RatingStars';

const Profile = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!authToken) throw new Error('User not authenticated');

        const response = await axios.get(
          `${config.backendURL}/api/accounts/profile/`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );

        setProfile(response.data);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authToken]);

  const handleDeleteProfile = async () => {
    try {
      if (!authToken) throw new Error('User not authenticated');

      await axios.delete(`${config.backendURL}/api/accounts/profile/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      localStorage.clear();
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete profile.');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const navigateToMyRides = () => {
    navigate('/myrides');
  };

  const ProfileSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-48 sm:h-64 bg-gray-200 rounded-xl mb-24"></div>
      <div className="w-32 h-32 rounded-full bg-gray-200 absolute -mt-40 ml-8"></div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-gray-100 rounded-xl p-6 h-40"></div>
        <div className="lg:col-span-2 bg-gray-100 rounded-xl p-6 h-40"></div>
        <div className="bg-gray-100 rounded-xl p-6 h-40"></div>
        <div className="lg:col-span-2 bg-gray-100 rounded-xl p-6 h-40"></div>
      </div>
    </div>
  );

  const DeleteConfirmationModal = () => {
    if (!showDeleteDialog) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-md relative animate-fade-in">
          <button
            onClick={() => setShowDeleteDialog(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Delete Profile
            </h3>
            <p className="text-gray-600">
              Are you sure you want to delete your profile? This action cannot
              be undone and will permanently remove your data from our servers.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteDialog(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Cancel
            </button>

            <button
              onClick={handleDeleteProfile}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <Trash2 className="h-4 w-4" />
              Delete Profile
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header search={true} home={true} login={true} signup={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <ProfileSkeleton />
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-xl shadow-lg max-w-md w-full mx-auto">
            <p className="text-red-600 text-center font-medium">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200"
            >
              Back to Login
            </button>
          </div>
        ) : profile ? (
          <>
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
                      profile.profile_picture ||
                      'https://via.placeholder.com/150'
                    }
                    alt={`${profile.first_name} ${profile.last_name}`}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-emerald-500 rounded-full p-1">
                    <div className="bg-white rounded-full p-1">
                      {profile.gender === 'male' ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#4A6CF7"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-mars"
                        >
                          <path d="M16 3h5v5" />
                          <path d="m21 3-6.75 6.75" />
                          <circle cx="10" cy="14" r="6" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#F75D81"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-venus"
                        >
                          <path d="M12 15v7" />
                          <path d="M9 19h6" />
                          <circle cx="12" cy="9" r="6" />
                        </svg>
                      )}
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

              {/* Mobile Action Buttons */}
              <div className="md:hidden absolute right-4 -bottom-16">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="bg-emerald-500 text-white p-3 rounded-full shadow-lg hover:bg-emerald-600 transition-colors"
                >
                  <Pencil className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Mobile Tab Selector */}
            <div className="md:hidden mb-6 overflow-x-auto no-scrollbar flex border-b">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-4 py-3 flex-1 font-medium text-center ${
                  activeTab === 'info'
                    ? 'text-emerald-600 border-b-2 border-emerald-500'
                    : 'text-gray-500'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-4 py-3 flex-1 font-medium text-center ${
                  activeTab === 'documents'
                    ? 'text-emerald-600 border-b-2 border-emerald-500'
                    : 'text-gray-500'
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab('rides')}
                className={`px-4 py-3 flex-1 font-medium text-center ${
                  activeTab === 'rides'
                    ? 'text-emerald-600 border-b-2 border-emerald-500'
                    : 'text-gray-500'
                }`}
              >
                My Rides
              </button>
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
                      onClick={navigateToMyRides}
                      className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors border-b"
                    >
                      <Car className="h-5 w-5 mr-3 text-emerald-500" />
                      <span>My Rides</span>
                      <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                    </button>
                    <button
                      onClick={() => setShowDeleteDialog(true)}
                      className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5">
                  <div className="flex items-center mb-4">
                    <Shield className="h-6 w-6 text-emerald-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Verification Status
                    </h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Email</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        Verified
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phone</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        Verified
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">ID Card</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div
                className={`lg:col-span-3 space-y-6 ${
                  !activeTab || activeTab === 'info'
                    ? 'block'
                    : 'hidden md:block'
                }`}
              >
                {/* Personal Information Card */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Personal Information
                    </h3>
                    <div className="hidden md:block">
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                    </div>
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
                        Date of Birth
                      </label>
                      <div className="font-medium text-gray-800 flex items-center">
                        <Calendar className="h-4 w-4 text-emerald-500 mr-2" />
                        {profile.dob}
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
                      Address Information
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Street Address
                      </label>
                      <div className="font-medium text-gray-800 flex items-start">
                        <MapPin className="h-4 w-4 text-emerald-500 mr-2 mt-1 flex-shrink-0" />
                        <span>{profile.address}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          City
                        </label>
                        <div className="font-medium text-gray-800">
                          {profile.city}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Pincode
                        </label>
                        <div className="font-medium text-gray-800">
                          {profile.pincode}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Emergency Contact
                        </label>
                        <div className="font-medium text-gray-800 flex items-center">
                          <Mail className="h-4 w-4 text-emerald-500 mr-2" />
                          {profile.emergency_email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* My Rides Button - For Mobile View when in the Info tab */}
                <div className="md:hidden">
                  <button
                    onClick={navigateToMyRides}
                    className="w-full bg-emerald-500 text-white py-3 rounded-xl shadow-md hover:bg-emerald-600 transition-colors flex items-center justify-center font-medium"
                  >
                    <Car className="h-5 w-5 mr-2" />
                    View My Rides
                  </button>
                </div>
              </div>

              {/* Documents Tab Content - Only visible on mobile when selected */}
              <div
                className={`space-y-6 ${
                  activeTab === 'documents' ? 'block md:hidden' : 'hidden'
                }`}
              >
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Verification Documents
                    </h3>
                  </div>
                  <div className="p-6 space-y-6">
                    {profile.drivers_license && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                          Driver's License
                        </label>
                        <div className="relative rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={profile.drivers_license}
                            alt="Driver's License"
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute bottom-3 left-3 bg-white px-3 py-1.5 rounded-full text-sm text-gray-700 shadow-sm flex items-center">
                            <Shield className="h-4 w-4 text-green-500 mr-1" />
                            Verified
                          </div>
                        </div>
                      </div>
                    )}

                    {profile.identity_card && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                          Identity Card
                        </label>
                        <div className="relative rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={profile.identity_card}
                            alt="Identity Card"
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute bottom-3 left-3 bg-white px-3 py-1.5 rounded-full text-sm text-gray-700 shadow-sm flex items-center">
                            <Shield className="h-4 w-4 text-green-500 mr-1" />
                            Verified
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* My Rides Tab Content - Only visible on mobile when selected */}
              <div
                className={`space-y-6 ${
                  activeTab === 'rides' ? 'block md:hidden' : 'hidden'
                }`}
              >
                <div className="bg-white rounded-xl shadow-sm overflow-hidden text-center py-8 px-4">
                  <Car className="h-12 w-12 mx-auto text-emerald-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Your Ride History
                  </h3>
                  <p className="text-gray-600 mb-6">
                    View all your past and upcoming rides in one place
                  </p>
                  <button
                    onClick={navigateToMyRides}
                    className="bg-emerald-500 text-white py-3 px-8 rounded-full shadow-md hover:bg-emerald-600 transition-colors flex items-center justify-center font-medium mx-auto"
                  >
                    View My Rides
                  </button>
                </div>
              </div>

              {/* Document Section - Only visible on desktop */}
              <div className="hidden md:block lg:col-span-3 mt-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Verification Documents
                    </h3>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile.drivers_license && (
                      <div className="relative group">
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                          Driver's License
                        </label>
                        <div className="relative rounded-lg overflow-hidden border border-gray-200 group-hover:shadow-md transition-shadow duration-200">
                          <img
                            src={profile.drivers_license}
                            alt="Driver's License"
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute bottom-3 left-3 bg-white px-3 py-1.5 rounded-full text-sm text-gray-700 shadow-sm flex items-center">
                            <Shield className="h-4 w-4 text-green-500 mr-1" />
                            Verified
                          </div>
                        </div>
                      </div>
                    )}

                    {profile.identity_card && (
                      <div className="relative group">
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                          Identity Card
                        </label>
                        <div className="relative rounded-lg overflow-hidden border border-gray-200 group-hover:shadow-md transition-shadow duration-200">
                          <img
                            src={profile.identity_card}
                            alt="Identity Card"
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute bottom-3 left-3 bg-white px-3 py-1.5 rounded-full text-sm text-gray-700 shadow-sm flex items-center">
                            <Shield className="h-4 w-4 text-green-500 mr-1" />
                            Verified
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal />
          </>
        ) : null}
      </div>
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updatedProfile) => setProfile(updatedProfile)}
        />
      )}
      {/* Add padding at the bottom when bottom navbar is visible */}
      <div className="md:hidden h-16"></div>
    </div>
  );
};

export default Profile;
