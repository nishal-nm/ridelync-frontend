import { ArrowRight, MapPin } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toDMY, toLicense } from '../utils/Convertions';

const LinkCard = (props) => {
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);

  const handleSendInvite = async () => {
    setIsSending(true);
    await props.contactMail(props.ride);
    setIsSending(false);
  };

  return (
    <div
      key={props.ride.mapping_id}
      id={props.ride.mapping_id}
      className="bg-white rounded-lg shadow-md p-6 border border-dashed border-gray-300"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-center gap-3 md:flex-row md:justify-between ">
          {/* Location information */}
          <div className="flex justify-between md:justify-start items-center gap-2 text-gray-600 text-sm">
            <div className="flex items-center gap-2 flex-1 md:flex-none justify-center">
              <MapPin className="h-4 w-4 text-emerald-500" />
              <span className="font-medium">{props.ride.start_loc}</span>
            </div>
            <ArrowRight className="md:block h-4 w-4 flex-1 md:flex-none justify-center" />
            <div className="flex items-center justify-center gap-2 flex-1 md:flex-none">
              <MapPin className="h-4 w-4 text-emerald-500" />
              <span className="font-medium">{props.ride.end_loc}</span>
            </div>
          </div>
        </div>

        {/* Ride details */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="text-center md:text-left">
              <div
                className="font-medium text-lg cursor-pointer"
                onClick={() =>
                  navigate(`/userprofile/${props.ride.rider_name}`)
                }
              >
                {props.ride.rider_name}
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-gray-600">
                {toDMY(props.ride.detection_date)}
              </div>
            </div>

            <div className="text-gray-600 md:ml-4">
              {toLicense(props.ride.vehicle_number)}
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto justify-between">
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={handleSendInvite}
                disabled={isSending}
                className="w-full md:w-auto px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                {isSending ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkCard;