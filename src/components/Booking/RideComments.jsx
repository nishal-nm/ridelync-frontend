import axios from 'axios';
import {
  ArrowDown,
  Calendar,
  Clock,
  Loader2,
  MessageSquare,
  Route,
  Star,
  StarHalf,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import config from '../../config';
import Header from '../Header';

const RideComments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authToken = localStorage.getItem('authToken');
  const { rideId } = useParams();
  const ride = location.state?.ride;

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRideComments = async () => {
      try {
        const response = await axios.get(
          `${config.backendURL}/api/rides/my-rides/${rideId}/comments`,
          {
            headers: {
              Authorization: `Token ${authToken}`
            },
          }
        );
        setComments(response.data);
      } catch (err) {
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRideComments();
  }, [authToken, rideId]);

  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400">No rating</span>;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="w-5 h-5 fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          className="w-5 h-5 fill-yellow-400 text-yellow-400"
        />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }

    return <div className="flex">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header search={true} />
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Ride details card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ride Details
          </h2>

          <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Route className="w-6 h-6 text-blue-700" />
              </div>
              <p className="text-gray-500 text-sm">Route</p>
            </div>
            <div className="flex-1">
              <div className="flex md:flex-row flex-col items-center gap-2 font-medium text-lg">
                <span className="text-gray-800">{ride.from_location}</span>
                <span className="md:-rotate-90">
                  <ArrowDown className="w-5 h-5 text-gray-600" />
                </span>
                <span className="text-gray-800">{ride.to_location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            Ride Ratings & Comments
          </h2>

          {comments.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-4 bg-gray-100 rounded-full inline-flex mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2 font-medium">No comments yet</p>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                This ride hasn't received any ratings or comments from
                passengers.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-white"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() =>
                        navigate(`/userprofile/${comment.rater_id}`)
                      }
                    >
                      <img
                        src={comment.profile}
                        alt="profile pic"
                        className="w-12 h-12 bg-blue-100 rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                          {comment.rater}
                        </h3>
                        <p className="text-gray-500 text-sm">Passenger</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-500 text-sm mb-1">Rating</div>
                      {renderStars(comment.stars)}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 leading-relaxed">
                      {comment.comment || 'No written comment provided.'}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(
                          comment.time || Date.now()
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(
                          comment.time || Date.now()
                        ).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Add padding at the bottom when bottom navbar is visible */}
      <div className="md:hidden h-16"></div>
    </div>
  );
};

export default RideComments;
