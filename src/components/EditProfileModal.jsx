import axios from 'axios';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import config from '../config';
import FileUpload from './ui/FileUpload';

const EditProfileModal = ({ profile, onClose, onUpdate }) => {
  const authToken = localStorage.getItem('authToken'); // Get auth token
  const [formData, setFormData] = useState({
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    phone_number: profile.phone_number || '',
    dob: profile.dob || '',
    gender: profile.gender || '',
    address: profile.address || '',
    city: profile.city || '',
    pincode: profile.pincode || '',
    language: profile.language || '',
    emergency_email: profile.emergency_email || '',
    profile_picture: '',
    drivers_license: '',
    identity_card: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!authToken) throw new Error('User not authenticated'); // Prevent unauthorized updates

      const response = await axios.put(
        `${config.backendURL}/api/accounts/profile/update/`,
        formData,
        {
          headers: {
            Authorization: `Token ${authToken}`, // Send token for authentication
            'Content-Type': 'multipart/form-data', // Required for file uploads
          },
        }
      );

      onUpdate(response.data); // Update UI with new profile data
      window.location.reload(); // Refresh page to reflect changes
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3} // This makes it around 2-3 lines high
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                placeholder="Enter your address..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Email
              </label>
              <input
                type="text"
                name="emergency_email"
                value={formData.emergency_email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture
              </label>
              <FileUpload
                updateFilesCb={(file) =>
                  setFormData({ ...formData, profile_picture: file })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver's License
              </label>
              <FileUpload
                updateFilesCb={(file) =>
                  setFormData({ ...formData, drivers_license: file })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Identity Card
              </label>
              <FileUpload
                updateFilesCb={(file) =>
                  setFormData({ ...formData, identity_card: file })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
