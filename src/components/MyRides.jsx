import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import Header from './Header';
import OtpModal from './OtpModal';
import { ConfirmModal } from './ui/Modal';
import RideCard from './ui/RideCard';

const MyRides = () => {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [bookerUserIds, setbookerUserIds] = useState(0);
  const [bookerUserNames, setbookerUserNames] = useState();

  const navigate = useNavigate();
  const [myRides, setMyRides] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const authToken = localStorage.getItem('authToken'); // Get token

  // Open OTP modal for a specific ride
  const requestOtpForRide = (ride) => {
    setSelectedRide(ride.id);

    setbookerUserIds(ride.booker_user_ids); // Get total number of bookers

    setbookerUserNames(ride.booker_user_names);
    setShowOtpModal(true);
  };

  const handleOtpConfirm = async () => {
    setShowOtpModal(false);

    try {
      const response = await axios.put(
        `${config.backendURL}/api/rides/my-rides/${selectedRide}/start/`,
        {}, // Send array of OTPs to backend
        {
          headers: { Authorization: `Token ${authToken}` },
        }
      );

      console.log('Ride started successfully:', response.data);
      fetchMyRides();
    } catch (err) {
      console.error('Failed to start ride:', err.response?.data || err.message);
    }
  };

  function confirmCancel() {
    if (selectedRide) {
      handleDelete(selectedRide);
    }
    setShowModal(false);
  }

  function closeModal() {
    setShowModal(false);
    setSelectedRide(null);
  }

  const fetchMyRides = async () => {
    if (!authToken) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${config.backendURL}/api/rides/my-rides/`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
      setMyRides(response.data);
    } catch (err) {
      setError('Failed to fetch your rides. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMyRides();
  }, [authToken]);

  // Update the ride status and refresh list
  const updateStatus = async (rideId, newStatus) => {
    try {
      const response = await axios.put(
        `${config.backendURL}/api/rides/my-rides/${rideId}/update/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        console.log('Status updated successfully:', response.data);
        fetchMyRides(); // Refresh ride list after updating status
      }
    } catch (error) {
      console.error(
        'Error updating status:',
        error.response?.data || error.message
      );
    }
  };

  const handleEnd = async (rideId) => {
    try {
      await axios.put(
        `${config.backendURL}/api/rides/my-rides/${rideId}/end/`,
        {},
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
      fetchMyRides(); // Refresh ride list after starting ride
    } catch (err) {
      alert('Failed to start ride. Please try again.');
    }
  };

  const showDeleteModal = (rideId) => {
    setSelectedRide(rideId);
    setShowModal(true);
  };

  const handleDelete = async (rideId) => {
    setDeleteLoading(rideId);
    try {
      await axios.delete(`${config.backendURL}/api/rides/delete/${rideId}/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      fetchMyRides(); // Refresh ride list after deletion
    } catch (err) {
      alert('Failed to delete ride. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div>
      <Header search={true} home={true} login={true} signup={true} />
      <div className="max-w-7xl mx-auto p-4">
        <div
          className={`md:block flex flex-col md:flex-row items-center justify-between mb-6`}
        >
          <h1 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
            My Rides
          </h1>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-4 py-2 bg-gray-100 rounded-lg">
              All ({myRides?.total || 0})
            </span>
            <span className="px-4 py-2 bg-gray-100 rounded-lg">
              Car (
              {myRides?.rides.filter((r) => r.vehicle_type === 'Car').length ||
                0}
              )
            </span>
            <span className="px-4 py-2 bg-gray-100 rounded-lg">
              Bike (
              {myRides?.rides.filter((r) => r.vehicle_type === 'Bike').length ||
                0}
              )
            </span>
          </div>
        </div>

        {loading && (
          <p className="text-center text-gray-500">Loading your rides...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {myRides?.rides.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              You haven't posted any rides yet
            </h2>
            <button
              onClick={() => navigate('/offer')}
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Offer a Ride
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <OtpModal
              isOpen={showOtpModal}
              onClose={() => setShowOtpModal(false)}
              onConfirm={handleOtpConfirm}
              bookerUserIds={bookerUserIds} // Pass dynamic total bookers count
              bookerUserNames={bookerUserNames}
            />

            {myRides?.rides.map((ride) => (
              <RideCard
                ride={ride}
                user={true}
                deleteLoading={deleteLoading}
                showDeleteModal={showDeleteModal}
                handleStart={() => requestOtpForRide(ride)}
                updateStatus={updateStatus}
                handleEnd={handleEnd}
              />
            ))}
            <div className="flex justify-end">
              <button
                onClick={() => navigate('/offer')}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Offer a Ride
              </button>
            </div>
          </div>
        )}
      </div>
      {showModal && (
        <ConfirmModal
          confirm={confirmCancel}
          closeModal={closeModal}
          que="Are you sure you want to cancel the ride?"
          head="Confirm Cancelling"
          no="No"
          yes="Yes"
        />
      )}
      {/* Add padding at the bottom when bottom navbar is visible */}
      <div className="md:hidden h-16"></div>
    </div>
  );
};

export default MyRides;
