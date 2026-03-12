import axios from 'axios';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  MessageSquare,
  Star,
  StarHalf,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import config from '../../config';
import Header from '../Header';
import { toLicense } from '../utils/Convertions';

const BookRide = () => {
  const authToken = localStorage.getItem('authToken');
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const rideId = params.rideId || location.state?.rideId;

  const [ride, setRide] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    ride_id: rideId,
    passenger_count: 1,
    pickup_note: '',
    payment_method: 'cash',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    const fetchRideDetails = async () => {
      if (!rideId) {
        setError('Ride ID is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${config.backendURL}/api/rides/${rideId}/`,
          {}
        );

        setRide(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ride details:', error);
        setError('Failed to load ride details. Please try again.');
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [rideId, authToken]);

  const handleChange = (e) => {
    setBookingDetails({
      ...bookingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authToken) {
      navigate('/login');
      return;
    }

    if (!acceptedTerms) {
      setError('You must accept the terms and conditions to proceed.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(
        `${config.backendURL}/api/rides/book-ride/`,
        bookingDetails,
        {
          headers: { Authorization: `Token ${authToken}` },
        }
      );

      // Redirect user to "Booked Rides" page
      navigate('/booked-rides');
    } catch (error) {
      console.error('Booking failed', error);
      setError('Booking failed. Please try again.');
    }
    setLoading(false);
  };

  const openTermsModal = (e) => {
    e.preventDefault();
    setShowTermsModal(true);
  };

  const acceptTerms = () => {
    setAcceptedTerms(true);
    setShowTermsModal(false);
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400">No rating</span>;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="w-3 h-3 fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          className="w-3 h-3 fill-yellow-400 text-yellow-400"
        />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />);
    }

    return <div className="flex">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
            <button
              onClick={() => navigate(-1)}
              className="block mt-4 text-sm text-red-700 hover:text-red-900"
            >
              ← Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
            No ride details available.
            <button
              onClick={() => navigate(-1)}
              className="block mt-4 text-sm text-yellow-700 hover:text-yellow-900"
            >
              ← Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back</span>
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Book Your Ride
            </h2>

            {/* Driver and Ride Info */}
            <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-100">
              <div
                className="flex items-center cursor-pointer bg-gray-200 p-2 rounded-md mb-4 justify-between"
                onClick={() => {
                  navigate(`/userprofile/${ride.user}`);
                }}
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={ride.rider_profile}
                    alt="profile of rider"
                    className="w-10 h-10 rounded-full"
                  />
                  <h3 className="font-semibold text-lg">{ride.rider_name}</h3>
                </div>
                <div>{renderStars(ride.rider_rating)}</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="h-5 w-5 text-emerald-500" />
                  <span>
                    {ride.from_location} → {ride.to_location}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="h-5 w-5 text-emerald-500" />
                  <span>{ride.date}</span>
                  <Clock className="h-5 w-5 ml-4 text-emerald-500" />
                  <span>{ride.time}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Users className="h-5 w-5 text-emerald-500" />
                  <span>{ride.seats} seats available</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600">Vehicle Type:</span>
                  <span className="text-gray-800 font-medium">
                    {ride.vehicle_type}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Vehicle Number:</span>
                  <span className="text-gray-800 font-medium">
                    {toLicense(ride.license)}
                  </span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Number of Passengers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Passengers
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="passenger_count"
                    value={bookingDetails.passenger_count}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {[...Array(ride.seats)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'passenger' : 'passengers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pickup Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Note (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="pickup_note"
                    placeholder="E.g., Pick me up at the main entrance"
                    value={bookingDetails.pickup_note}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="payment_method"
                    value={bookingDetails.payment_method}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="cash">Cash</option>
                    {/* <option value="card">Credit/Debit Card</option> */}
                  </select>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Price per seat</span>
                  <span>₹{ride.price}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Passengers</span>
                  <span>× {bookingDetails.passenger_count}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{ride.price * bookingDetails.passenger_count}</span>
                </div>
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="flex items-start mt-6">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-700">
                    I agree to the{' '}
                    <button
                      onClick={openTermsModal}
                      className="text-emerald-600 hover:text-emerald-700 underline font-medium"
                    >
                      Terms and Conditions
                    </button>
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Footer Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !acceptedTerms}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Terms and Conditions
              </h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-gray-700">
              {/* Terms content here (unchanged) */}
              <h4 className="font-semibold text-lg">1. Booking and Payments</h4>
              <p>
                By booking a ride through our platform, you agree to pay the
                full amount shown at the time of booking. Payment methods
                available are specified during the booking process. The ride
                fare is calculated based on distance, duration, and other
                factors.
              </p>

              <h4 className="font-semibold text-lg">2. Cancellation Policy</h4>
              <p>
                Cancellations made more than 24 hours before the scheduled ride
                are eligible for a full refund. Cancellations made within 24
                hours of the scheduled ride may be subject to a cancellation fee
                of up to 50% of the ride fare.
              </p>

              <h4 className="font-semibold text-lg">3. Ride Conduct</h4>
              <p>
                Passengers are expected to behave respectfully during the ride.
                The driver reserves the right to refuse service to passengers
                who are intoxicated, abusive, or otherwise disruptive. No
                smoking, eating, or drinking is allowed in the vehicle without
                the driver's permission.
              </p>

              <h4 className="font-semibold text-lg">4. Safety</h4>
              <p>
                All passengers must wear seatbelts at all times during the ride.
                Children must be accompanied by an adult and use appropriate
                child safety seats as required by law. The driver will follow
                all traffic laws and safety regulations.
              </p>

              <h4 className="font-semibold text-lg">5. Personal Belongings</h4>
              <p>
                We are not responsible for any lost, stolen, or damaged personal
                belongings left in the vehicle. Passengers are responsible for
                taking all their belongings when exiting the vehicle.
              </p>

              <h4 className="font-semibold text-lg">6. Privacy Policy</h4>
              <p>
                We collect and process personal data in accordance with our
                Privacy Policy. By using our service, you consent to the
                collection and processing of your personal data as described in
                our Privacy Policy.
              </p>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={acceptTerms}
                className="px-5 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Accept Terms
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add padding at the bottom when bottom navbar is visible */}
      <div className="md:hidden h-16"></div>
    </div>
  );
};

export default BookRide;
