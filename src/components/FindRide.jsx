import axios from 'axios';
import { ArrowRight, Calendar, Search, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import Header from './Header';
import RideCard from './ui/RideCard';

const FindRide = () => {
  const [tripDetails, setTripDetails] = useState({
    from_location: '',
    to_location: '',
    date: '',
    passengers: 1,
  });

  const [allRides, setAllRides] = useState(null);
  const [filteredRides, setFilteredRides] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');
  const displayRides = filteredRides || allRides;
  const isSearchActive = filteredRides !== null;

  useEffect(() => {
    const fetchAllRides = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${config.backendURL}/api/rides/all/`,
          {}
        );
        setAllRides(response.data);

        setFilteredRides(null);
      } catch (err) {
        setError('Failed to fetch rides. Please try again.');
      }

      setLoading(false);
    };
    fetchAllRides();
  }, []);

  const handleChange = (e) => {
    setTripDetails({
      ...tripDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMobileFiltersOpen(false);

    try {
      const response = await axios.get(`${config.backendURL}/api/rides/find/`, {
        params: {
          from_location: tripDetails.from_location,
          to_location: tripDetails.to_location,
          date: tripDetails.date,
          seats: tripDetails.passengers,
        }
      });

      setFilteredRides(response.data);
    } catch (err) {
      setError('Failed to fetch rides. Please try again.');
    }

    setLoading(false);
  };

  const handleBook = (ride) => {
    if (authToken) {
      navigate(`/book/${ride.id}`);
    } else {
      navigate('/login');
    }
  };

  const handleClearSearch = () => {
    setTripDetails({
      from_location: '',
      to_location: '',
      date: '',
      passengers: 1,
    });
    setFilteredRides(null);
    setMobileFiltersOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header search={true} login={true} signup={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Toggle Button */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="w-full py-4 bg-emerald-500 text-white rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-emerald-600 transition-all duration-200 font-medium"
          >
            {mobileFiltersOpen ? (
              <>
                <X className="h-5 w-5" /> Close Search
              </>
            ) : (
              <>
                <Search className="h-5 w-5" /> Find Your Ride
              </>
            )}
          </button>
        </div>

        {/* Search Form - Mobile Responsive */}
        <div
          className={`
          bg-white rounded-xl shadow-lg mb-8 transition-all duration-300 transform
          ${
            mobileFiltersOpen
              ? 'scale-100 opacity-100'
              : 'scale-95 opacity-0 md:scale-100 md:opacity-100'
          }
          ${mobileFiltersOpen ? 'block' : 'hidden'} md:block
        `}
        >
          <form onSubmit={handleSearch} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <select
                    name="from_location"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-0 transition-colors bg-white ${
                      tripDetails.from_location ? 'text-black' : 'text-gray-500'
                    }`}
                    value={tripDetails.from_location}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled hidden>
                      From
                    </option>
                    <option value="Kozhikode">Kozhikode</option>
                    <option value="Vadakara">Vadakara</option>
                    <option value="Koyilandy">Koyilandy</option>
                    <option value="Feroke">Feroke</option>
                    <option value="Ramanattukara">Ramanattukara</option>
                    <option value="Balussery">Balussery</option>
                    <option value="Perambra">Perambra</option>

                    <option value="Malappuram">Malappuram</option>
                    <option value="Manjeri">Manjeri</option>
                    <option value="Perinthalmanna">Perinthalmanna</option>
                    <option value="Kottakkal">Kottakkal</option>
                    <option value="Tirur">Tirur</option>
                    <option value="Nilambur">Nilambur</option>
                    <option value="Ponnani">Ponnani</option>
                    <option value="Edappal">Edappal</option>
                    <option value="Tanur">Tanur</option>
                    <option value="Areekode">Areekode</option>
                    <option value="Valanchery">Valanchery</option>
                    <option value="Wandoor">Wandoor</option>
                    <option value="Pandikkad">Pandikkad</option>

                    <option value="Wayanad">Kalpetta</option>
                    <option value="Mananthavady">Mananthavady</option>
                    <option value="Sulthan Bathery">Sulthan Bathery</option>
                    <option value="Vythiri">Vythiri</option>
                    <option value="Meppadi">Meppadi</option>
                    <option value="Pulpally">Pulpally</option>

                    <option value="Palakkad">Palakkad</option>
                    <option value="Ottapalam">Ottapalam</option>
                    <option value="Chittur">Chittur</option>
                    <option value="Pattambi">Pattambi</option>
                    <option value="Shoranur">Shoranur</option>
                    <option value="Cherpulassery">Cherpulassery</option>
                    <option value="Alathur">Alathur</option>
                    <option value="Mannarkkad">Mannarkkad</option>
                    <option value="Kongad">Kongad</option>
                    <option value="Kuzhalmannam">Kuzhalmannam</option>

                    <option value="Thrissur">Thrissur</option>
                    <option value="Irinjalakuda">Irinjalakuda</option>
                    <option value="Kodungallur">Kodungallur</option>
                    <option value="Guruvayur">Guruvayur</option>
                    <option value="Chalakudy">Chalakudy</option>
                    <option value="Wadakkanchery">Wadakkanchery</option>
                    <option value="Kunnamkulam">Kunnamkulam</option>
                    <option value="Chavakkad">Chavakkad</option>
                    <option value="Pudukkad">Pudukkad</option>
                  </select>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <select
                    name="to_location"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-0 transition-colors bg-white ${
                      tripDetails.to_location ? 'text-black' : 'text-gray-500'
                    }`}
                    value={tripDetails.to_location}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled hidden>
                      To
                    </option>
                    <option value="Kozhikode">Kozhikode</option>
                    <option value="Vadakara">Vadakara</option>
                    <option value="Koyilandy">Koyilandy</option>
                    <option value="Feroke">Feroke</option>
                    <option value="Ramanattukara">Ramanattukara</option>
                    <option value="Balussery">Balussery</option>
                    <option value="Perambra">Perambra</option>

                    <option value="Malappuram">Malappuram</option>
                    <option value="Manjeri">Manjeri</option>
                    <option value="Perinthalmanna">Perinthalmanna</option>
                    <option value="Kottakkal">Kottakkal</option>
                    <option value="Tirur">Tirur</option>
                    <option value="Nilambur">Nilambur</option>
                    <option value="Ponnani">Ponnani</option>
                    <option value="Edappal">Edappal</option>
                    <option value="Tanur">Tanur</option>
                    <option value="Areekode">Areekode</option>
                    <option value="Valanchery">Valanchery</option>
                    <option value="Wandoor">Wandoor</option>
                    <option value="Pandikkad">Pandikkad</option>

                    <option value="Wayanad">Kalpetta</option>
                    <option value="Mananthavady">Mananthavady</option>
                    <option value="Sulthan Bathery">Sulthan Bathery</option>
                    <option value="Vythiri">Vythiri</option>
                    <option value="Meppadi">Meppadi</option>
                    <option value="Pulpally">Pulpally</option>

                    <option value="Palakkad">Palakkad</option>
                    <option value="Ottapalam">Ottapalam</option>
                    <option value="Chittur">Chittur</option>
                    <option value="Pattambi">Pattambi</option>
                    <option value="Shoranur">Shoranur</option>
                    <option value="Cherpulassery">Cherpulassery</option>
                    <option value="Alathur">Alathur</option>
                    <option value="Mannarkkad">Mannarkkad</option>
                    <option value="Kongad">Kongad</option>
                    <option value="Kuzhalmannam">Kuzhalmannam</option>

                    <option value="Thrissur">Thrissur</option>
                    <option value="Irinjalakuda">Irinjalakuda</option>
                    <option value="Kodungallur">Kodungallur</option>
                    <option value="Guruvayur">Guruvayur</option>
                    <option value="Chalakudy">Chalakudy</option>
                    <option value="Wadakkanchery">Wadakkanchery</option>
                    <option value="Kunnamkulam">Kunnamkulam</option>
                    <option value="Chavakkad">Chavakkad</option>
                    <option value="Pudukkad">Pudukkad</option>
                  </select>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-0 transition-colors"
                    value={tripDetails.date}
                    onChange={handleChange}
                    name="date"
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <select
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-0 transition-colors appearance-none"
                    value={tripDetails.passengers}
                    onChange={handleChange}
                    name="passengers"
                  >
                    {[1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="lg:col-span-1 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  Search
                </button>
                {isSearchActive && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {displayRides && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {isSearchActive ? (
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <span>{tripDetails.from_location}</span>
                    <ArrowRight className="h-5 w-5 text-emerald-500" />
                    <span>{tripDetails.to_location}</span>
                  </div>
                ) : (
                  <h2 className="text-2xl font-bold text-gray-800">
                    Available Rides
                  </h2>
                )}
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-6 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium">
                    All ({displayRides.total})
                  </span>
                  <span className="px-6 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium">
                    Car (
                    {
                      displayRides.rides.filter((r) => r.vehicle_type === 'Car')
                        .length
                    }
                    )
                  </span>
                  <span className="px-6 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium">
                    Bike (
                    {
                      displayRides.rides.filter(
                        (r) => r.vehicle_type === 'Bike'
                      ).length
                    }
                    )
                  </span>
                </div>
              </div>
            </div>

            {displayRides.total === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  No rides available
                </h2>
                <p className="text-gray-600">
                  Try adjusting your search criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {displayRides.rides.map((ride) => (
                  <RideCard
                    key={ride.id}
                    ride={ride}
                    user={false}
                    handleBook={handleBook}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Loading & Error States */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center">
            {error}
          </div>
        )}
      </div>
      {/* Add padding at the bottom when bottom navbar is visible */}
      <div className="md:hidden h-16"></div>
    </div>
  );
};

export default FindRide;
