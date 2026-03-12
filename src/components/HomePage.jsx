import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import CarModel from './ui/CarModel';

function HomePage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  useEffect(() => {
    // Get full name from local storage
    const storedName = localStorage.getItem('fullName');
    if (storedName) {
      setFullName(storedName);
    }
  }, []);

  const handleOfferRide = () => {
    fullName ? navigate('/offer') : navigate('/login');
  };

  return (
    <div
      className="relative flex min-h-screen w-full flex-col bg-[#FFFFFF] group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Plus Jakarta Sans, Noto Sans, sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Header search={true} home={true} login={true} signup={true} />
        <div className="px-4 sm:px-6 md:px-10 lg:px-16 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-6xl flex-1 mx-auto">
            <div className="@container">
              <div className="flex flex-col gap-6 px-4 py-10 @[480px]:gap-8 @[864px]:flex-row">
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl @[480px]:h-auto @[480px]:min-w-[400px] @[864px]:w-full shadow-sm"
                  // style={{
                  //   backgroundImage: 'url("/images/homepage_globe.png")',
                  // }}
                >
                  <CarModel />
                </div>
                <div className="flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 @[864px]:justify-center">
                  <div className="flex flex-col gap-2 text-left">
                    <h1 className="text-[#1C160C] text-2xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">
                      Welcome to RideLync!
                    </h1>
                    <h2 className="text-[#1C160C] text-sm sm:text-base font-normal leading-normal">
                      Find or offer rides for your daily commutes. Save time,
                      save money, and help the environment by sharing your
                      journey.
                    </h2>
                  </div>
                  <div className="flex-wrap gap-3 flex">
                    <button
                      onClick={() => navigate('/search')}
                      className="flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 sm:h-12 sm:px-5 bg-[#019863] text-[#FFFFFF] text-sm sm:text-base font-bold leading-normal tracking-[0.015em] transition-all hover:bg-[#017e52] shadow-sm"
                    >
                      <span className="truncate">Find a Ride</span>
                    </button>
                    <button
                      onClick={handleOfferRide}
                      className="flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 sm:h-12 sm:px-5 bg-[#F4EFE6] text-[#1C160C] text-sm sm:text-base font-bold leading-normal tracking-[0.015em] transition-all hover:bg-[#e5e0d7] shadow-sm"
                    >
                      <span className="truncate">Offer a Ride</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 py-6">
              <div className="flex flex-col gap-3 pb-3 hover:transform hover:scale-[1.01] transition-all duration-300">
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl shadow-sm"
                  style={{
                    backgroundImage: 'url("/images/homepage_offer.png")',
                  }}
                ></div>
                <div>
                  <p className="text-[#1C160C] text-base font-medium leading-normal">
                    Offer a Ride
                  </p>
                  <p className="text-[#A18249] text-sm font-normal leading-normal">
                    Offer a ride in your vehicle and share your journey.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3 hover:transform hover:scale-[1.01] transition-all duration-300">
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl shadow-sm"
                  style={{
                    backgroundImage: 'url("/images/homepage_find.png")',
                  }}
                ></div>
                <div>
                  <p className="text-[#1C160C] text-base font-medium leading-normal">
                    Find a Ride
                  </p>
                  <p className="text-[#A18249] text-sm font-normal leading-normal">
                    Find a ride that fits your schedule and route.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 py-6">
              <div className="flex flex-1 gap-3 rounded-lg border border-[#E9DFCE] bg-[#FFFFFF] p-4 flex-col hover:shadow-md transition-all duration-300">
                <div
                  className="text-[#019863]"
                  data-icon="Leaf"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M223.45,40.07a8,8,0,0,0-7.52-7.52C139.8,28.08,78.82,51,52.82,94a87.09,87.09,0,0,0-12.76,49c.57,15.92,5.21,32,13.79,47.85l-19.51,19.5a8,8,0,0,0,11.32,11.32l19.5-19.51C81,210.73,97.09,215.37,113,215.94q1.67.06,3.33.06A86.93,86.93,0,0,0,162,203.18C205,177.18,227.93,116.21,223.45,40.07ZM153.75,189.5c-22.75,13.78-49.68,14-76.71.77l88.63-88.62a8,8,0,0,0-11.32-11.32L65.73,179c-13.19-27-13-54,.77-76.71,22.09-36.47,74.6-56.44,141.31-54.06C210.2,114.89,190.22,167.41,153.75,189.5Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-[#1C160C] text-base font-bold leading-tight">
                    Eco-Friendly
                  </h2>
                  <p className="text-[#A18249] text-sm font-normal leading-normal">
                    Reduce your carbon footprint by sharing rides.
                  </p>
                </div>
              </div>
              <div className="flex flex-1 gap-3 rounded-lg border border-[#E9DFCE] bg-[#FFFFFF] p-4 flex-col hover:shadow-md transition-all duration-300">
                <div
                  className="text-[#019863]"
                  data-icon="Wallet"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M216,72H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,64V192a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72Zm0,128H56a8,8,0,0,1-8-8V86.63A23.84,23.84,0,0,0,56,88H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,140Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-[#1C160C] text-base font-bold leading-tight">
                    Cost-Effective
                  </h2>
                  <p className="text-[#A18249] text-sm font-normal leading-normal">
                    Save on travel costs by splitting the fare.
                  </p>
                </div>
              </div>
              <div className="flex flex-1 gap-3 rounded-lg border border-[#E9DFCE] bg-[#FFFFFF] p-4 flex-col hover:shadow-md transition-all duration-300">
                <div
                  className="text-[#019863]"
                  data-icon="Watch"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M208,128a79.94,79.94,0,0,0-32.7-64.47l-6.24-34.38A16,16,0,0,0,153.32,16H102.68A16,16,0,0,0,86.94,29.15L80.7,63.53a79.9,79.9,0,0,0,0,128.94l6.24,34.38A16,16,0,0,0,102.68,240h50.64a16,16,0,0,0,15.74-13.15l6.24-34.38A79.94,79.94,0,0,0,208,128ZM102.68,32h50.64l3.91,21.55a79.75,79.75,0,0,0-58.46,0ZM64,128a64,64,0,1,1,64,64A64.07,64.07,0,0,1,64,128Zm89.32,96H102.68l-3.91-21.55a79.75,79.75,0,0,0,58.46,0ZM120,128V88a8,8,0,0,1,16,0v32h32a8,8,0,0,1,0,16H128A8,8,0,0,1,120,128Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-[#1C160C] text-base font-bold leading-tight">
                    Time-Saving
                  </h2>
                  <p className="text-[#A18249] text-sm font-normal leading-normal">
                    Cut down your travel time with efficient routes.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 mt-4 mx-auto w-full max-w-4xl bg-[#F9F7F4] rounded-lg shadow-sm">
              <div className="p-2 border-b border-[#E9DFCE]">
                <h2 className="text-[#1C160C] text-lg font-bold mb-2">
                  How It Works
                </h2>
              </div>
              <div className="flex justify-between gap-x-6 py-3 hover:bg-[#F4EFE6] px-3 rounded-md transition-colors">
                <p className="text-[#A18249] text-sm font-medium leading-normal">
                  1. Sign Up
                </p>
                <p className="text-[#1C160C] text-sm font-normal leading-normal text-right">
                  Create an account to get started.
                </p>
              </div>
              <div className="flex justify-between gap-x-6 py-3 hover:bg-[#F4EFE6] px-3 rounded-md transition-colors">
                <p className="text-[#A18249] text-sm font-medium leading-normal">
                  2. Post/Find Ride
                </p>
                <p className="text-[#1C160C] text-sm font-normal leading-normal text-right">
                  List your ride or search for available rides.
                </p>
              </div>
              <div className="flex justify-between gap-x-6 py-3 hover:bg-[#F4EFE6] px-3 rounded-md transition-colors">
                <p className="text-[#A18249] text-sm font-medium leading-normal">
                  3. Match with Travelers
                </p>
                <p className="text-[#1C160C] text-sm font-normal leading-normal text-right">
                  Connect with others going the same way.
                </p>
              </div>
              <div className="flex justify-between gap-x-6 py-3 hover:bg-[#F4EFE6] px-3 rounded-md transition-colors">
                <p className="text-[#A18249] text-sm font-medium leading-normal">
                  4. Share Ride
                </p>
                <p className="text-[#1C160C] text-sm font-normal leading-normal text-right">
                  Enjoy your shared journey and repeat!
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Improved Footer Section with Credits */}
        <footer className="border-t border-[#E9DFCE] py-8 mt-8 bg-[#FCFBF9]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-[#1C160C] text-sm mb-4 md:mb-0">
              <span>
                &copy; {new Date().getFullYear()} RideLync. All rights reserved.
              </span>
            </div>
            <div className="text-[#A18249] text-sm">
              Designed &amp; Developed by
              <span className="font-medium text-[#019863]"> Team RideLync</span>
            </div>
          </div>
        </footer>
      </div>
      {/* Add padding at the bottom when bottom navbar is visible */}
      <div className="md:hidden h-16"></div>
    </div>
  );
}

export default HomePage;
