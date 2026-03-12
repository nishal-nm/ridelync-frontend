import axios from 'axios';
import {
  AlertCircle,
  CreditCard,
  MapPin,
  Trash2,
  UserRound,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import config from '../../config';
import Header from '../Header';

const MyBookedRides = () => {
  const authToken = localStorage.getItem('authToken');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [emergencyLocation, setEmergencyLocation] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLocationFetched, setIsLocationFetched] = useState(false);

  // Rating modal states
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0); // 0 to 5 stars
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchBookedRides = async () => {
      try {
        const response = await axios.get(
          `${config.backendURL}/api/rides/booked-rides/`,
          {
            headers: {
              Authorization: `Token ${authToken}`
            },
          }
        );
        setBookings(response.data);
      } catch (err) {
        setError('Failed to load booked rides.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookedRides();
  }, [authToken]);

  const handleCancelRide = async (bookingId) => {
    try {
      await axios.delete(
        `${config.backendURL}/api/rides/booked-rides/${bookingId}/delete`,
        {
          headers: { Authorization: `Token ${authToken}` },
        }
      );

      setBookings((prevBookings) =>
        prevBookings.filter((b) => b.id !== bookingId)
      );
    } catch (err) {
      alert('Failed to cancel the ride. Try again.');
    }
  };

  // Rating submission handler
  const handleSubmitRating = async () => {
    if (rating > 0 && comment) {
      try {
        await axios.post(
          `${config.backendURL}/api/rides/booked-rides/${selectedBooking.id}/rate`,
          {
            rating: rating,
            comment: comment,
          },
          {
            headers: { Authorization: `Token ${authToken}` },
          }
        );
        alert('Rating submitted successfully!');
        setShowRatingModal(false);
        setRating(0);
        setComment('');
      } catch (error) {
        alert('Failed to submit rating.');
      }
    } else {
      alert('Please provide both rating and comment.');
    }
  };

  // Emergency Button Click Handler
  const handleEmergency = (booking) => {
    setSelectedBooking(booking);
    setShowEmergencyModal(true);
    setCountdown(5);
    setIsLocationFetched(false);

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setEmergencyLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocationFetched(true);
        },
        (error) => {
          setEmergencyLocation(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setIsLocationFetched(true);
    }
  };

  // UseEffect to wait for location before sending emergency email
  useEffect(() => {
    if (isLocationFetched && selectedBooking) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            sendEmergencyEmail(selectedBooking);
            setShowEmergencyModal(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer); // Cleanup
    }
  }, [isLocationFetched, selectedBooking]);

  // Send Emergency Email
  const sendEmergencyEmail = async (booking) => {
    try {
      await axios.post(
        `${config.backendURL}/api/rides/emergency/`,
        {
          booking: booking,
          message: `Emergency Alert! User in distress during ride from ${booking.ride.start_location} to ${booking.ride.end_location}.`,
          location: emergencyLocation
            ? `https://www.google.com/maps?q=${emergencyLocation.lat},${emergencyLocation.lng}`
            : 'Location not available',
        },
        {
          headers: { Authorization: `Token ${authToken}` },
        }
      );

      alert('Emergency email sent successfully!');
    } catch (error) {
      alert('Failed to send emergency email.');
    }
  };

  return (
    <div>
      <Header search={true} />
      <div className="container mx-auto p-6 max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
          Booked Rides
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No rides booked.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span>{booking.ride.start_location}</span>
                    <span className="text-gray-400 mx-2">→</span>
                    <span>{booking.ride.end_location}</span>
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : booking.status === 'ACCEPTED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                  <div className="space-y-3">
                    <p className="flex items-center gap-2">
                      <UserRound className="w-4 h-4" />
                      <span className="font-medium">Driver:</span>
                      {booking.ride.ride_owner}
                    </p>
                    <p className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-medium">Payment Method:</span>
                      {booking.payment_method}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">Passengers:</span>
                      {booking.passenger_count}
                    </p>
                  </div>
                </div>

                {/* Emergency or Cancel/Delete Button */}
                <div className="mt-4 flex justify-end">
                  {booking.status === 'IN_PROGRESS' ? (
                    <button
                      onClick={() => handleEmergency(booking)}
                      className="px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 bg-red-500 text-white hover:bg-red-600"
                    >
                      🚨 EMERGENCY
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCancelRide(booking.id)}
                      className="px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      <Trash2 className="w-4 h-4" />
                      CANCEL
                    </button>
                  )}

                  {/* Rate Button */}
                  {booking.status === 'COMPLETED' && (
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowRatingModal(true);
                      }}
                      className="ml-4 px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Rate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Rate Your Ride</h2>
            <div className="flex gap-2 mb-4">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  onClick={() => setRating(index + 1)}
                  className={`cursor-pointer text-xl ${
                    rating > index ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              rows="4"
              placeholder="Leave a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRatingModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold">Emergency Alert</h2>
            <p className="mt-4">
              Sending emergency alert in {countdown} seconds...
            </p>
          </div>
        </div>
      )}
      {/* Add padding at the bottom when bottom navbar is visible */}
      <div className="md:hidden h-16"></div>
    </div>
  );
};

export default MyBookedRides;