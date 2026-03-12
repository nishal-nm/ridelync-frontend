import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, Calendar, MapPin, User } from 'lucide-react';
import config from '../../config';

const ReviewsSection = ({ userId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${config.backendURL}/api/accounts/reviews/${userId}/`
        );
        setReviews(response.data.reviews);
      } catch (err) {
        setError('Failed to load reviews.');
        console.error(err);
      }
      setLoading(false);
    };

    if (userId) {
      fetchReviews();
    }
  }, [userId]);

  // Function to format date string to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Generate stars based on rating
  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Reviews</h3>
        </div>
        <div className="p-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Reviews</h3>
        </div>
        <div className="p-6">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">
          Reviews & Ratings
        </h3>
      </div>
      <div className="p-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b pb-6 last:border-b-0 last:pb-0"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <img
                      src={
                        review.reviewer.profile_picture ||
                        'https://via.placeholder.com/40'
                      }
                      alt={`${review.reviewer.first_name} ${review.reviewer.last_name}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {review.reviewer.first_name} {review.reviewer.last_name}
                      </h4>
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Calendar size={12} className="mr-1" />
                      <span>{formatDate(review.rated_at)}</span>
                      <div className="mx-2">•</div>
                      <MapPin size={12} className="mr-1" />
                      <span>
                        {review.ride_details.from} to {review.ride_details.to}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-sm text-gray-700">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;