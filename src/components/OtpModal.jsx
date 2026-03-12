import axios from 'axios';
import React, { useState } from 'react';
import config from '../config';

const OtpModal = ({
  isOpen,
  onClose,
  onConfirm,
  bookerUserIds = [],
  bookerUserNames = [],
}) => {
  const [otps, setOtps] = useState(Array(bookerUserIds.length).fill(''));
  const [verified, setVerified] = useState(
    Array(bookerUserIds.length).fill(false)
  );
  const [otpSent, setOtpSent] = useState(
    Array(bookerUserIds.length).fill(false)
  ); // Track OTP sent status
  const [loading, setLoading] = useState(
    Array(bookerUserIds.length).fill(false)
  ); // Track loading state

  if (!isOpen) return null;

  const handleOtpChange = (index, value) => {
    const updatedOtps = [...otps];
    updatedOtps[index] = value;
    setOtps(updatedOtps);
  };

  const handleSendOtp = async (index) => {
    const bookerId = bookerUserIds[index];
    setLoading((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });

    try {
      const response = await axios.post(
        `${config.backendURL}/api/rides/my-rides/send-otp/`,
        {
          booker_id: bookerId, // API to send OTP
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`, // Ensure correct authentication
          },
        }
      );

      if (response.data.success) {
        setOtpSent((prev) => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      } else {
        alert('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP sending failed:', error);
      alert('An error occurred while sending OTP.');
    } finally {
      setLoading((prev) => {
        const newState = [...prev];
        newState[index] = false;
        return newState;
      });
    }
  };

  const handleVerify = async (index) => {
    const otpToVerify = otps[index];
    const bookerId = bookerUserIds[index];

    try {
      const response = await axios.post(
        `${config.backendURL}/api/rides/my-rides/verify-otp/`,
        {
          otp: otpToVerify,
          booker_id: bookerId,
        }
      );

      if (response.data.success) {
        setVerified((prev) => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP Verification failed:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const allVerified = verified.every((status) => status);

  const handleConfirm = () => {
    if (allVerified) {
      onConfirm(otps);
      setOtps(Array(bookerUserIds.length).fill(''));
      setVerified(Array(bookerUserIds.length).fill(false));
      setOtpSent(Array(bookerUserIds.length).fill(false)); // Reset OTP sent status
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter OTPs</h2>

        {bookerUserIds.map((bookerId, index) => (
          <div key={bookerId} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={otps[index]}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              placeholder={`Enter OTP from ${bookerUserNames[index]}`}
              className={`w-full p-2 border rounded-md ${
                verified[index]
                  ? 'bg-green-100 border-green-500'
                  : 'border-gray-300'
              }`}
              disabled={!otpSent[index] || verified[index]} // Disable until OTP is sent
            />
            <button
              onClick={() =>
                otpSent[index] ? handleVerify(index) : handleSendOtp(index)
              }
              className={`px-3 py-2 rounded-lg text-white ${
                verified[index]
                  ? 'bg-gray-400 cursor-not-allowed'
                  : otpSent[index]
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-yellow-500 hover:bg-yellow-600'
              }`}
              disabled={verified[index] || loading[index]} // Disable when loading or verified
            >
              {loading[index]
                ? '...'
                : verified[index]
                ? '✔'
                : otpSent[index]
                ? 'Verify'
                : 'Send'}
            </button>
          </div>
        ))}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg text-white ${
              allVerified
                ? 'bg-emerald-500 hover:bg-emerald-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!allVerified}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
