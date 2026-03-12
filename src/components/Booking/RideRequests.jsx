import axios from 'axios';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  CreditCard,
  Loader2,
  Users,
  XCircle,
  XOctagon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import config from '../../config';
import Header from '../Header';

const RideRequests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authToken = localStorage.getItem('authToken');
  const { rideId } = useParams();
  const ride = location.state?.ride;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRideRequests = async () => {
      try {
        const response = await axios.get(
          `${config.backendURL}/api/rides/my-rides/${rideId}`,
          {
            headers: {
              Authorization: `Token ${authToken}`
            },
          }
        );
        setRequests(response.data);
      } catch (err) {
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRideRequests();
  }, [authToken, rideId]);

  const acceptRequest = async (requestId) => {
    try {
      await axios.put(
        `${config.backendURL}/api/rides/my-rides/${requestId}/accept/`,
        {},
        {
          headers: { Authorization: `Token ${authToken}` },
        }
      );
      window.location.reload();
    } catch (err) {
      alert('Failed to accept request.');
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      await axios.put(
        `${config.backendURL}/api/rides/my-rides/${requestId}/reject/`,
        {},
        {
          headers: { Authorization: `Token ${authToken}` },
        }
      );
      window.location.reload();
    } catch (err) {
      alert('Failed to reject request.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Header search={true} />
      <div className="container mx-auto p-6 max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-3">
          <span>{ride.from_location}</span>
          <ArrowRight className="w-5 h-5 text-gray-600" />
          <span>{ride.to_location}</span>
        </h2>

        {requests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No Ride Requests for this ride.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((request) => (
              <div
                key={request.id}
                className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3
                    className="text-lg font-semibold text-gray-800 flex items-center gap-2 cursor-pointer"
                    onClick={() =>
                      navigate(`/userprofile/${request.booker_id}`)
                    }
                  >
                    <Users className="w-5 h-5 text-gray-500" />
                    {request.booker_name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                      request.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : request.status === 'ACCEPTED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {request.status === 'PENDING' ? (
                      <Clock className="w-4 h-4" />
                    ) : request.status === 'ACCEPTED' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XOctagon className="w-4 h-4 text-red-500" />
                    )}

                    {request.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                  <div className="space-y-3">
                    <p className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">Pickup Note:</span>
                      {request.pickup_note || 'None'}
                    </p>

                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">Passengers:</span>
                      {request.passenger_count}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-medium">Payment Method:</span>
                      {request.payment_method}
                    </p>
                  </div>
                </div>

                {request.status === 'PENDING' && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <button
                      onClick={() => acceptRequest(request.id)}
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => rejectRequest(request.id)}
                      className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Add padding at the bottom when bottom navbar is visible */}
      <div className="md:hidden h-16"></div>
    </div>
  );
};

export default RideRequests;
