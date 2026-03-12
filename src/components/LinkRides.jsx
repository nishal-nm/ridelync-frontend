import axios from 'axios';
import { React, useEffect, useState } from 'react';
import config from '../config';
import Header from './Header';
import LinkCard from './ui/LinkCard';
import Popup from './ui/Popup'; // Import the new Popup component

const LinkRides = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allRides, setAllRides] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    const fetchAllRides = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${config.backendURL}/api/ai/all/`);
        setAllRides(response.data);
      } catch (err) {
        setError('Failed to fetch rides. Please try again.');
      }

      setLoading(false);
    };
    fetchAllRides();
  }, []);

  const contactMail = async (ride) => {
    try {
      const response = await axios.post(
        `${config.backendURL}/api/ai/send-mail/`,
        {
          receiver_email: ride.rider_email,
          receiver_name: ride.rider_name,
          start_loc: ride.start_loc,
          end_loc: ride.end_loc,
          webapp_url: 'https://rideshare-wheat.vercel.app/',
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`, // Include the auth token
            'Content-Type': 'application/json',
          },
        }
      );
      setPopupMessage(response.data.message);
      setPopupVisible(true);
    } catch (error) {
      setPopupMessage('Failed to send email. Please try again.');
      setPopupVisible(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header search={true} login={true} signup={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Section */}
        {allRides && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Available Rides
                </h2>
              </div>
            </div>

            {allRides.total === 0 ? (
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
                {allRides.rides.map((ride) => (
                  <LinkCard
                    key={ride.id}
                    ride={ride}
                    contactMail={contactMail}
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

      {/* Popup */}
      {popupVisible && (
        <Popup message={popupMessage} onClose={() => setPopupVisible(false)} />
      )}
    </div>
  );
};

export default LinkRides;
