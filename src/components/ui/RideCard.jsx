import {
  ArrowRight,
  Bike,
  Car,
  ChevronDown,
  MapPin,
  Share2,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { to12Hour, toDMY, toLicense } from '../utils/Convertions';

const RideCard = (props) => {
  const user_id = localStorage.getItem('user_id');
  const navigate = useNavigate();
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // Toggle Status Dropdown
  const toggleStatusOptions = () => setShowStatusOptions(!showStatusOptions);

  // Generate and copy share link
  const handleShareRide = (e) => {
    e.stopPropagation();

    // Create a URL for the ride
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/book/${props.ride.id}`;

    // Copy to clipboard
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
      })
      .catch((err) => {
        console.error('Failed to copy link: ', err);
      });
  };

  return (
    <div
      key={props.ride.id}
      id={props.ride.id}
      className="bg-white rounded-lg shadow-md p-6 border border-dashed border-gray-300"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-center gap-3 md:flex-row md:justify-between ">
          {/* Location information */}
          <div className="flex justify-between md:justify-start items-center gap-2 text-gray-600 text-sm">
            <div className="flex items-center gap-2 flex-1 md:flex-none justify-center">
              <MapPin className="h-4 w-4 text-emerald-500" />
              <span className="font-medium">{props.ride.from_location}</span>
            </div>
            <ArrowRight className="md:block h-4 w-4 flex-1 md:flex-none justify-center" />
            <div className="flex items-center justify-center gap-2 flex-1 md:flex-none">
              <MapPin className="h-4 w-4 text-emerald-500" />
              <span className="font-medium">{props.ride.to_location}</span>
            </div>
          </div>

          {/* Status Dropdown and Share Button */}
          {props.user && (
            <div className="relative flex justify-center items-center gap-2">
              <div
                onClick={
                  props.ride.status === 'OPEN' || props.ride.status === 'CLOSED'
                    ? toggleStatusOptions
                    : undefined
                }
                className={`px-4 py-1 rounded-md text-sm font-semibold uppercase tracking-wide shadow-sm border border-dashed cursor-pointer flex items-center gap-2 ${
                  props.ride.status === 'OPEN'
                    ? 'bg-green-50 text-green-700 border-green-400'
                    : props.ride.status === 'FULL'
                    ? 'bg-red-50 text-red-700 border-red-400'
                    : props.ride.status === 'COMPLETED'
                    ? 'bg-gray-100 text-gray-700 border-gray-400'
                    : props.ride.status === 'CLOSED'
                    ? 'bg-gray-200 text-gray-800 border-gray-500'
                    : props.ride.status === 'ONGOING'
                    ? 'bg-blue-50 text-blue-700 border-blue-400'
                    : 'bg-gray-50 text-gray-600 border-gray-300'
                }`}
              >
                {props.ride.status}
                {(props.ride.status === 'OPEN' ||
                  props.ride.status === 'CLOSED') && (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>

              {/* Share Button */}
              {props.ride.status === 'OPEN' && (
                <button
                  onClick={handleShareRide}
                  className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                  title="Generate Share Link"
                >
                  <Share2 className="h-4 w-4 text-gray-600" />
                </button>
              )}

              {/* Copy Link Toast Notification */}
              {showShareToast && (
                <div className="absolute -top-10 right-0 bg-gray-800 text-white px-3 py-1 rounded-md text-xs">
                  Link copied!
                </div>
              )}

              {/* Dropdown Menu */}
              {showStatusOptions && (
                <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-300 shadow-lg rounded-md text-sm z-10">
                  <button
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      props.updateStatus(props.ride.id, 'OPEN');
                      setShowStatusOptions(false);
                    }}
                  >
                    OPEN
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      props.updateStatus(props.ride.id, 'CLOSED');
                      setShowStatusOptions(false);
                    }}
                  >
                    CLOSED
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Ride details */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-full">
              {props.ride.vehicle_type === 'Car' ? (
                <Car className="h-6 w-6 text-gray-600" />
              ) : (
                <Bike className="h-6 w-6 text-gray-600" />
              )}
            </div>
            {!props.user && (
              <div className="text-center md:text-left">
                <div
                  className="font-medium text-lg cursor-pointer"
                  onClick={() => navigate(`/userprofile/${props.ride.user}`)}
                >
                  {props.ride.rider_name}
                </div>
                <div className="text-gray-500">{props.ride._vehicle_type}</div>
              </div>
            )}
            <div className="text-center md:text-left">
              <div className="text-gray-600">
                {toDMY(props.ride.date)} • {to12Hour(props.ride.time)}
              </div>
            </div>
            {props.user && (
              <div className="text-gray-600 md:ml-4">
                {toLicense(props.ride.license)}
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto justify-between">
            <div className="text-gray-600 text-center w-full md:w-auto">
              {props.ride.seats}{' '}
              {props.ride.seats > 1 ? 'seats available' : 'seat available'}
            </div>
            <div className="text-xl font-semibold text-emerald-600 text-center w-full md:w-auto">
              ₹{props.ride.price}
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              {!props.user ? (
                user_id != props.ride.user ? (
                  <button
                    onClick={() => props.handleBook(props.ride)}
                    className="w-full md:w-auto px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Book
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/myrides#${props.ride.id}`)}
                    className="w-full md:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    View
                  </button>
                )
              ) : props.ride.status != 'ONGOING' ? (
                <div className="flex flex-col md:flex-row w-full gap-2">
                  {props.ride.status != 'COMPLETED' && (
                    <button
                      className="w-full md:w-auto px-4 py-2 rounded-lg transition-colors bg-green-100 text-green-600 hover:bg-green-200"
                      onClick={() => props.handleStart(props.ride.id)}
                    >
                      Start Journey
                    </button>
                  )}
                  {props.ride.status != 'COMPLETED' && (
                    <button
                      className="w-full md:w-auto px-4 py-2 rounded-lg transition-colors bg-blue-100 text-blue-600 hover:bg-blue-200"
                      onClick={() =>
                        navigate(`/myrides/${props.ride.id}`, {
                          state: { ride: props.ride },
                        })
                      }
                    >
                      View Requests
                    </button>
                  )}

                  {props.ride.status == 'COMPLETED' && (
                    <button
                      className="w-full md:w-auto px-4 py-2 rounded-lg transition-colors bg-blue-100 text-blue-600 hover:bg-blue-200"
                      onClick={() =>
                        navigate(`/myrides/comments/${props.ride.id}`, {
                          state: { ride: props.ride },
                        })
                      }
                    >
                      View Comments
                    </button>
                  )}

                  <button
                    className={`w-full md:w-auto px-4 py-2 rounded-lg transition-colors ${
                      props.deleteLoading === props.ride.id
                        ? 'bg-red-100 text-red-400 cursor-not-allowed'
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                    onClick={() => props.showDeleteModal(props.ride.id)}
                    disabled={props.deleteLoading === props.ride.id}
                  >
                    {props.deleteLoading === props.ride.id
                      ? props.ride.status !== 'COMPLETED'
                        ? 'Cancelling...'
                        : 'Deleting...'
                      : props.ride.status !== 'COMPLETED'
                      ? 'Cancel'
                      : 'Delete'}
                  </button>
                </div>
              ) : (
                <button
                  className="w-full md:w-auto px-4 py-2 rounded-lg transition-colors bg-red-100 text-red-600 hover:bg-red-200"
                  onClick={() => props.handleEnd(props.ride.id)}
                >
                  End Journey
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideCard;
