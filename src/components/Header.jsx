import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  CheckBadgeIcon,
  HomeIcon,
  MapIcon,
  UserCircleIcon,
  UserGroupIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/24/solid';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '../config';
import { ConfirmModal } from './ui/Modal';

function Header(props) {
  const authToken = localStorage.getItem('authToken');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const location = useLocation();

  const [fullName, setFullName] = useState('');
  useEffect(() => {
    // Get full name from local storage
    const storedName = localStorage.getItem('fullName');
    if (storedName) {
      setFullName(storedName);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Navigation functions
  const handleLogin = () => navigate('/login');
  const handleSignup = () => navigate('/signup');
  const handleLinkRides = () => navigate('/link');
  const handleBookedRides = () => navigate('/booked-rides');
  const handleHome = () => navigate('/');
  const handleProfile = () => navigate('/profile');
  const handleCommunity = () => navigate('/chat');

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    setShowModal(true);
  };
  const confirmLogout = () => {
    localStorage.clear();
    setShowModal(false);
    window.location.href = '/';
  };
  const closeModal = () => setShowModal(false);

  // Function to search users
  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `${config.backendURL}/api/accounts/search/`,
        {
          params: { query: trimmedQuery },
          headers: {
            ...(authToken && { Authorization: `Token ${authToken}` })
          },
        }
      );

      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    }
  };

  // Debounce effect for search
  useEffect(() => {
    if (!searchQuery) {
      setShowSearchResults(false);
      return;
    }

    const debounceTimer = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchFocus = () => {
    if (searchQuery) {
      setShowSearchResults(true);
    }
  };

  const handleProfileClick = (userId) => {
    navigate(`/userprofile/${userId}`);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  // Check if current path matches the given path
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.includes(path);
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-solid border-b-[#F4EFE6] bg-white">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px',
          }}
        ></div>

        <div className="relative flex items-center justify-between px-4 md:px-10 py-3 z-10">
          {/* Logo with shadow effect */}
          <div
            className="flex items-center text-[#1C160C] cursor-pointer group"
            onClick={handleHome}
          >
            <div className="relative">
              <img
                src={'/icons/ridelync.svg'}
                alt="RideLync"
                width="50"
                height="50"
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-green-100 to-green-50 rounded-full blur opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-10"></div>
            </div>

            <h2 className="hidden md:block ml-2 text-[#1C160C] text-lg font-bold leading-tight tracking-[-0.015em] select-none cursor-pointer">
              RideLync
            </h2>
          </div>

          {/* Search Icon for Mobile */}
          {props.search && (
            <div className="w-full px-5 md:hidden block">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchFocus}
                    className="w-full px-4 py-2 pl-10 bg-[#F4EFE6] rounded-full text-sm font-medium text-[#1C160C] placeholder-[#1C160C]/60 focus:outline-none focus:ring-2 focus:ring-[#1C160C]/20 shadow-sm"
                    autoFocus
                  />
                  <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#1C160C]/60" />
                </div>
              </form>

              {/* Mobile Search Results */}
              {searchResults.length > 0 ? (
                <div className="absolute w-auto mt-2 bg-white rounded-lg shadow-lg border border-[#F4EFE6] overflow-hidden z-50 animate-fadeIn">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleProfileClick(user.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F4EFE6] transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-[#1C160C]/10 flex items-center justify-center overflow-hidden shadow-sm">
                        <img
                          src={
                            user.profile_picture ||
                            'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'
                          }
                          alt={user.full_name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-[#1C160C]">
                          {user.full_name}
                        </p>
                        <p className="text-xs text-[#1C160C]/60">
                          {user.username}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : searchQuery.length > 0 ? (
                <div className="mt-4 text-center text-sm text-gray-500">
                  No users found matching "{searchQuery}"
                </div>
              ) : null}
            </div>
          )}
          {/* Profile/Login Button for Mobile */}
          {fullName ? (
            <button
              onClick={toggleDropdown}
              onTouchStart={toggleDropdown}
              className="md:hidden block flex items-center gap-2 bg-[#F4EFE6] p-2 rounded-full cursor-pointer hover:bg-[#E9E4DB] transition-colors shadow-sm hover:shadow"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <div className="h-7 w-7 rounded-full bg-[#1C160C] flex items-center justify-center text-white font-medium shadow-inner text-xs">
                {fullName.charAt(0).toUpperCase()}
              </div>
            </button>
          ) : (
            <button
              onClick={handleLogin}
              onTouchStart={handleLogin}
              className="md:hidden block flex items-center gap-2 bg-[#F4EFE6] px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#E9E4DB] transition-colors shadow-sm hover:shadow"
            >
              <ArrowLeftEndOnRectangleIcon className="h-5 w-5 text-[#1C160C]" />
            </button>
          )}

          {/* Mobile Dropdown Menu */}
          {dropdownOpen && (
            <div className="md:hidden block absolute right-4 top-14 w-56 bg-white rounded-lg shadow-lg border border-[#F4EFE6] overflow-hidden z-50 animate-fadeIn">
              <div className="px-4 py-3 bg-[#F4EFE6]">
                <p className="text-sm text-[#1C160C] font-medium">
                  Signed in as
                </p>
                <p className="text-sm font-bold text-[#1C160C] truncate">
                  {fullName}
                </p>
              </div>
              <div className="py-2">
                <button
                  onClick={handleLogout}
                  onTouchStart={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  Log out
                </button>
              </div>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search Bar */}
            {props.search && (
              <div className="flex-1 max-w-xl mx-8 relative" ref={searchRef}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                >
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={handleSearchFocus}
                      className="w-full px-4 py-2 pl-10 bg-[#F4EFE6] rounded-full text-sm font-medium text-[#1C160C] placeholder-[#1C160C]/60 focus:outline-none focus:ring-2 focus:ring-[#1C160C]/20 transition-all shadow-sm hover:shadow-md"
                    />
                    <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#1C160C]/60" />
                  </div>
                </form>

                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-[#F4EFE6] overflow-hidden z-50 animate-fadeIn">
                    {searchResults.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleProfileClick(user.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F4EFE6] transition-colors"
                      >
                        <div className="h-8 w-8 rounded-full bg-[#1C160C]/10 flex items-center justify-center overflow-hidden shadow-sm">
                          <img
                            src={
                              user.profile_picture ||
                              'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'
                            }
                            alt={user.full_name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg';
                            }}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-[#1C160C]">
                            {user.full_name}
                          </p>
                          <p className="text-xs text-[#1C160C]/60">
                            {user.username}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {fullName && (
              <button
                onClick={handleCommunity}
                className={`flex items-center gap-1 text-sm font-medium leading-normal transition-colors px-4 py-2 rounded-lg ${
                  location.pathname === '/chat'
                    ? 'bg-green-100 font-bold text-green-800'
                    : 'text-[#1C160C] hover:text-[#1C160C]/80 hover:bg-[#F4EFE6]/70'
                }`}
              >
                <UserGroupIcon className="h-5 w-5" />
                Community
              </button>
            )}

            {fullName && (
              <button
                onClick={handleLinkRides}
                className={`flex items-center gap-1 text-sm font-medium leading-normal transition-colors px-4 py-2 rounded-lg ${
                  location.pathname === '/link'
                    ? 'bg-green-100 font-bold text-green-800'
                    : 'text-[#1C160C] hover:text-[#1C160C]/80 hover:bg-[#F4EFE6]/70'
                }`}
              >
                <MapIcon className="h-5 w-5" />
                Link Rides
              </button>
            )}

            {fullName && (
              <button
                onClick={handleBookedRides}
                className={`flex items-center gap-1 text-sm font-medium leading-normal transition-colors px-4 py-2 rounded-lg ${
                  location.pathname === '/booked-rides'
                    ? 'bg-green-100 font-bold text-green-800'
                    : 'text-[#1C160C] hover:text-[#1C160C]/80 hover:bg-[#F4EFE6]/70'
                }`}
              >
                <CheckBadgeIcon className="h-5 w-5" />
                Booked Rides
              </button>
            )}

            {fullName ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  onTouchStart={toggleDropdown}
                  className="flex items-center gap-2 bg-[#F4EFE6] px-2 py-2 rounded-full cursor-pointer hover:bg-[#E9E4DB] transition-colors shadow-sm hover:shadow"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="h-8 w-8 rounded-full bg-[#1C160C] flex items-center justify-center text-white font-medium shadow-inner">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#F4EFE6] overflow-hidden z-50 animate-fadeIn">
                    <div className="px-4 py-3 bg-[#F4EFE6]">
                      <p className="text-sm text-[#1C160C] font-medium">
                        Signed in as
                      </p>
                      <p className="text-sm font-bold text-[#1C160C] truncate">
                        {fullName}
                      </p>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={handleProfile}
                        onTouchStart={handleProfile}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#1C160C] hover:bg-[#F4EFE6] transition-colors"
                      >
                        <UserCircleIcon className="h-5 w-5" />
                        Profile
                      </button>
                      <div className="my-2 border-t border-[#F4EFE6]"></div>
                      <button
                        onClick={handleLogout}
                        onTouchStart={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {props.login && (
                  <button
                    onClick={handleLogin}
                    onTouchStart={handleLogin}
                    className="flex items-center gap-2 bg-[#F4EFE6] px-4 py-2 rounded-full cursor-pointer hover:bg-[#E9E4DB] transition-colors shadow-sm hover:shadow"
                  >
                    <UserIcon className="h-5 w-5 text-[#1C160C]" />
                    <span className="text-[#1C160C] text-sm font-medium leading-normal">
                      Log in
                    </span>
                  </button>
                )}
                {props.signup && (
                  <button
                    onClick={handleSignup}
                    onTouchStart={handleSignup}
                    className="flex items-center gap-2 bg-[#1C160C] px-4 py-2 rounded-full cursor-pointer hover:bg-[#1C160C]/90 transition-colors shadow-sm hover:shadow"
                  >
                    <span className="text-white text-sm font-medium leading-normal">
                      Sign up
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Bottom Mobile Navigation Bar */}
      {fullName && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#F4EFE6] z-40 shadow-lg">
          <div className="grid grid-cols-5 h-16">
            {/* Home Button */}
            <button
              onClick={handleHome}
              onTouchStart={handleHome}
              className={`relative flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${
                isActive('/') ? 'text-green-600' : 'text-[#1C160C]/70'
              }`}
            >
              <div
                className={`absolute -top-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-300 ${
                  isActive('/') ? 'scale-100' : 'scale-0'
                }`}
              >
                <HomeIcon className="h-6 w-6" />
              </div>
              <HomeIcon
                className={`h-6 w-6 transition-transform duration-300 ${
                  isActive('/') ? 'scale-0' : 'scale-100'
                }`}
              />
              <span className="text-xs font-medium">Home</span>
            </button>

            {/* Community Button */}
            <button
              onClick={handleCommunity}
              onTouchStart={handleCommunity}
              className={`relative flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${
                isActive('/chat') ? 'text-green-600' : 'text-[#1C160C]/70'
              }`}
            >
              <div
                className={`absolute -top-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-300 ${
                  isActive('/chat') ? 'scale-100' : 'scale-0'
                }`}
              >
                <UserGroupIcon className="h-6 w-6" />
              </div>
              <UserGroupIcon
                className={`h-6 w-6 transition-transform duration-300 ${
                  isActive('/chat') ? 'scale-0' : 'scale-100'
                }`}
              />
              <span className="text-xs font-medium">Community</span>
            </button>

            {/* Link Rides Button */}
            <button
              onClick={handleLinkRides}
              onTouchStart={handleLinkRides}
              className={`relative flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${
                isActive('/link') ? 'text-green-600' : 'text-[#1C160C]/70'
              }`}
            >
              <div
                className={`absolute -top-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-300 ${
                  isActive('/link') ? 'scale-100' : 'scale-0'
                }`}
              >
                <MapIcon className="h-6 w-6" />
              </div>
              <MapIcon
                className={`h-6 w-6 transition-transform duration-300 ${
                  isActive('/link') ? 'scale-0' : 'scale-100'
                }`}
              />
              <span className="text-xs font-medium">Link Rides</span>
            </button>

            {/* Booked Rides Button */}
            <button
              onClick={handleBookedRides}
              onTouchStart={handleBookedRides}
              className={`relative flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${
                isActive('/booked-rides')
                  ? 'text-green-600'
                  : 'text-[#1C160C]/70'
              }`}
            >
              <div
                className={`absolute -top-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-300 ${
                  isActive('/booked-rides') ? 'scale-100' : 'scale-0'
                }`}
              >
                <CheckBadgeIcon className="h-6 w-6" />
              </div>
              <CheckBadgeIcon
                className={`h-6 w-6 transition-transform duration-300 ${
                  isActive('/booked-rides') ? 'scale-0' : 'scale-100'
                }`}
              />
              <span className="text-xs font-medium">Booked</span>
            </button>

            {/* Profile Button */}
            <button
              onClick={handleProfile}
              onTouchStart={handleProfile}
              className={`relative flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${
                isActive('/profile') ? 'text-green-600' : 'text-[#1C160C]/70'
              }`}
            >
              <div
                className={`absolute -top-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-300 ${
                  isActive('/profile') ? 'scale-100' : 'scale-0'
                }`}
              >
                <UserCircleIcon className="h-6 w-6" />
              </div>
              <UserCircleIcon
                className={`h-6 w-6 transition-transform duration-300 ${
                  isActive('/profile') ? 'scale-0' : 'scale-100'
                }`}
              />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </nav>
      )}

      {/* Logout Confirmation Modal */}
      {showModal && (
        <ConfirmModal
          confirm={confirmLogout}
          closeModal={closeModal}
          que="Are you sure you want to log out?"
          head="Confirm Logout"
          no="Cancel"
          yes="Log Out"
          className="z-50"
        />
      )}

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

export default Header;
