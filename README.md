# 🚗 RideLync — Frontend

> React-based web application for the RideLync intelligent route-matching and ride-sharing platform.

RideLync connects commuters traveling similar routes by analyzing recurring vehicle movement data. This frontend provides the full user-facing experience — from registration and ride search to real-time chat and bookings.

---

## 🧠 What It Does

- Browse and search available rides by route
- Offer your own ride for others to book
- Book rides and manage booking requests
- Real-time 1-on-1 and group chat with other users
- View and rate other riders via public profiles
- Link rides — connect with users detected on similar routes
- OTP-based registration and forgot password flow
- Responsive UI with smooth 3D landing experience

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19, React Router v7 |
| Styling | Tailwind CSS, Shadcn UI, Radix UI |
| HTTP Client | Axios |
| Maps | Google Maps API (`@react-google-maps/api`) |
| 3D / Animation | Three.js, React Three Fiber, Spline |
| Icons | Lucide React, Heroicons |
| Real-Time | WebSockets (Django Channels backend) |

---

## 📁 Project Structure

```
ridelync-frontend/
└── src/
    ├── App.js              # Route definitions
    ├── config.js           # Backend URL config
    └── components/
        ├── HomePage.jsx        # Landing page
        ├── Login.jsx           # Auth
        ├── Registration.jsx    # Sign up with OTP
        ├── FindRide.jsx        # Search available rides
        ├── OfferRide.jsx       # Post a ride
        ├── MyRides.jsx         # Manage your offered rides
        ├── LinkRides.jsx       # Route-matched ride suggestions
        ├── Profile.jsx         # User profile management
        ├── SearchProfile.jsx   # View other users' profiles
        ├── Booking/            # Booking flow & ride requests
        ├── Chat/               # Real-time chat (1-on-1 & group)
        └── ui/                 # Reusable components (cards, modals, ratings)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/nishal-nm/ridelync-frontend.git
cd ridelync-frontend

# Install dependencies
npm install
```

### Configuration

The backend URL is set in `src/config.js`:

```js
const config = {
  backendURL: 'https://ridelync-backend-t0y3.onrender.com',
};
```

To run against a local backend, change this to `http://localhost:8000`.

### Run the App

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

---

## 📸 Pages Overview

| Route | Page |
|-------|------|
| `/` | Home / Landing |
| `/login` | Login |
| `/signup` | Registration (with OTP) |
| `/search` | Find a Ride |
| `/offer` | Offer a Ride |
| `/myrides` | My Offered Rides |
| `/booked-rides` | My Booked Rides |
| `/link` | Route-Matched Ride Links |
| `/profile` | My Profile |
| `/chat` | Real-Time Chat |

---

## 🌐 Live Backend

Connected to: [https://ridelync-backend-t0y3.onrender.com](https://ridelync-backend-t0y3.onrender.com)

---

## 🔗 Related

- **Backend Repo:** [ridelync-backend](https://github.com/nishal-nm/ridelync-backend)
