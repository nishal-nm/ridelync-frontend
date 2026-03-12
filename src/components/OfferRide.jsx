import axios from 'axios';
import {
  Armchair,
  Calendar,
  Clock,
  IdCard,
  IndianRupee,
  MapPin,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import config from '../config';
import Header from './Header';
import { SuccessModal } from './ui/Modal';

const OfferRide = () => {
  const authToken = localStorage.getItem('authToken');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rideDetails, setRideDetails] = useState({
    from_location: '',
    to_location: '',
    date: '',
    time: '',
    seats: '',
    price: '',
    vehicle_type: 'Car',
    license: '',
  });

  function handleOk() {
    navigate('/myrides');
  }

  // Location options for the dropdowns
  const locationOptions = [
    { value: 'Kozhikode', label: 'Kozhikode' },
    { value: 'Vadakara', label: 'Vadakara' },
    { value: 'Koyilandy', label: 'Koyilandy' },
    { value: 'Feroke', label: 'Feroke' },
    { value: 'Ramanattukara', label: 'Ramanattukara' },
    { value: 'Balussery', label: 'Balussery' },
    { value: 'Perambra', label: 'Perambra' },
    { value: 'Malappuram', label: 'Malappuram' },
    { value: 'Manjeri', label: 'Manjeri' },
    { value: 'Perinthalmanna', label: 'Perinthalmanna' },
    { value: 'Kottakkal', label: 'Kottakkal' },
    { value: 'Tirur', label: 'Tirur' },
    { value: 'Nilambur', label: 'Nilambur' },
    { value: 'Ponnani', label: 'Ponnani' },
    { value: 'Edappal', label: 'Edappal' },
    { value: 'Tanur', label: 'Tanur' },
    { value: 'Areekode', label: 'Areekode' },
    { value: 'Valanchery', label: 'Valanchery' },
    { value: 'Wandoor', label: 'Wandoor' },
    { value: 'Pandikkad', label: 'Pandikkad' },
    { value: 'Kalpetta', label: 'Kalpetta' },
    { value: 'Mananthavady', label: 'Mananthavady' },
    { value: 'Sulthan Bathery', label: 'Sulthan Bathery' },
    { value: 'Vythiri', label: 'Vythiri' },
    { value: 'Meppadi', label: 'Meppadi' },
    { value: 'Pulpally', label: 'Pulpally' },
    // ... add all other locations
  ];

  // Custom styles for React-Select
  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '48px',
      paddingLeft: '2.5rem',
      borderRadius: '0.75rem',
      borderWidth: '2px',
      borderColor: state.isFocused ? '#10B981' : '#E5E7EB',
      boxShadow: state.isFocused ? '0 0 0 1px #10B981' : 'none',
      outline: 'none', // Remove default focus outline
      '&:hover': {
        borderColor: '#10B981',
      },
    }),
    input: (base) => ({
      ...base,
      color: '#000', // Ensure text color is normal
      boxShadow: 'none', // Remove any unwanted shadows
      outline: 'none', // Remove default browser highlight
      caretColor: '#10B981', // Customize caret color
    }),
    placeholder: (base) => ({
      ...base,
      color: '#6B7280',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#10B981'
        : state.isFocused
        ? '#E5E7EB'
        : 'white',
      '&:hover': {
        backgroundColor: '#E5E7EB',
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999, // Set higher z-index to prevent overlap issues
    }),
  };

  useEffect(() => {
    if (rideDetails.vehicle_type === 'Bike') {
      setRideDetails((prev) => ({ ...prev, seats: '1' }));
    }
  }, [rideDetails.vehicle_type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRideDetails({ ...rideDetails, [name]: value });
  };

  const handleLocationChange = (selectedOption, { name }) => {
    setRideDetails((prev) => ({
      ...prev,
      [name]: selectedOption.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!authToken) {
      alert('User not found. Please log in again.');
      return;
    }

    try {
      await axios.post(`${config.backendURL}/api/rides/create/`, rideDetails, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      setShowModal(true);
      setRideDetails({
        from_location: '',
        to_location: '',
        date: '',
        time: '',
        seats: '',
        price: '',
        vehicle_type: 'Car',
        license: '',
      });
    } catch (error) {
      console.error('Error offering the ride', error.response);
      alert('Failed to offer the ride. Please try again.');
    }

    setIsLoading(false);
  };

  // Rest of your component remains the same, but replace the location select elements with:
  return (
    <div className="min-h-screen bg-gray-50">
      <Header search={true} home={true} login={true} signup={true} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-emerald-500">
            <h1 className="text-2xl font-bold text-white">Offer a Ride</h1>
            <p className="text-emerald-50 mt-2">
              Share your journey with others
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Vehicle Type Selection */}
            <div className="bg-emerald-50 rounded-xl p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Vehicle Type
              </label>
              <div className="flex gap-6">
                {['Car', 'Bike'].map((type) => (
                  <label
                    key={type}
                    className="relative flex cursor-pointer items-center"
                  >
                    <input
                      type="radio"
                      name="vehicle_type"
                      value={type}
                      checked={rideDetails.vehicle_type === type}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 border-2 border-transparent peer-checked:border-emerald-500 peer-checked:bg-emerald-50 transition-all duration-200">
                      <span className="text-gray-700 font-medium">{type}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* From Location */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Location
              </label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                <Select
                  name="from_location"
                  options={locationOptions}
                  value={locationOptions.find(
                    (option) => option.value === rideDetails.from_location
                  )}
                  onChange={(option) =>
                    handleLocationChange(option, { name: 'from_location' })
                  }
                  styles={customStyles}
                  placeholder="Select Starting Point"
                  isSearchable
                  required
                />
              </div>
            </div>

            {/* To Location */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Location
              </label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                <Select
                  name="to_location"
                  options={locationOptions}
                  value={locationOptions.find(
                    (option) => option.value === rideDetails.to_location
                  )}
                  onChange={(option) =>
                    handleLocationChange(option, { name: 'to_location' })
                  }
                  styles={customStyles}
                  placeholder="Select Destination"
                  isSearchable
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Details */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Number
                </label>
                <div className="relative group">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="text"
                    name="license"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-0 transition-colors"
                    placeholder="License Plate Number"
                    value={rideDetails.license}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Date Field */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <div className="relative group">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="date"
                    name="date"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-0 transition-colors"
                    value={rideDetails.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Time Field */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <div className="relative group">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="time"
                    name="time"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-0 transition-colors"
                    value={rideDetails.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Seats Field */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seats Available
                </label>
                <div className="relative group">
                  <Armchair className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="number"
                    name="seats"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-0 transition-colors ${
                      rideDetails.vehicle_type === 'Bike' ? 'bg-gray-50' : ''
                    }`}
                    min="1"
                    max={rideDetails.vehicle_type === 'Bike' ? '1' : '4'}
                    placeholder="Number of seats"
                    value={
                      rideDetails.vehicle_type === 'Bike'
                        ? '1'
                        : rideDetails.seats
                    }
                    onChange={handleChange}
                    disabled={rideDetails.vehicle_type === 'Bike'}
                    required
                  />
                </div>
              </div>

              {/* Price Field */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {rideDetails.vehicle_type === 'Car'
                    ? 'Price per Seat'
                    : 'Price'}
                </label>
                <div className="relative group">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="number"
                    name="price"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-0 transition-colors"
                    min="0"
                    placeholder="Enter price"
                    value={rideDetails.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Posting...</span>
                  </div>
                ) : (
                  'Offer Ride'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <SuccessModal
          head="Ride Posted Successfully!"
          message="Your ride has been posted. Travelers can now see your ride and request to join."
          closeModal={handleOk}
        />
      )}
      {/* Add padding at the bottom when bottom navbar is visible */}
      <div className="md:hidden h-16"></div>
    </div>
  );
};

export default OfferRide;
