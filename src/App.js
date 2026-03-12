import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import BookRide from './components/Booking/BookRide';
import MyBookedRides from './components/Booking/MyBookedRides';
import RideComments from './components/Booking/RideComments';
import RideRequests from './components/Booking/RideRequests';
import Chat from './components/Chat/Chat';
import FindRide from './components/FindRide';
import ForgotPassword from './components/ForgotPassword';
import HomePage from './components/HomePage';
import LinkRides from './components/LinkRides';
import Login from './components/Login';
import MyRides from './components/MyRides';
import OfferRide from './components/OfferRide';
import Profile from './components/Profile';
import Registration from './components/Registration';
import SearchProfile from './components/SearchProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<FindRide />} />
        <Route path="/offer" element={<OfferRide />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/myrides" element={<MyRides />} />
        <Route path={'/profile'} element={<Profile />} />
        <Route path={'/userprofile/:userId'} element={<SearchProfile />} />
        <Route path={'/book/:rideId'} element={<BookRide />} />
        <Route path={'/booked-rides'} element={<MyBookedRides />} />
        <Route path="/myrides/:rideId" element={<RideRequests />} />
        <Route path="/myrides/comments/:rideId" element={<RideComments />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/link" element={<LinkRides />} />
      </Routes>
    </Router>
  );
}

export default App;
