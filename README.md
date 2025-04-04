# RailEase - Train Booking System

![RailEase Logo](https://via.placeholder.com/150x50?text=RailEase)  
*A modern train booking system with comprehensive features*

## Table of Contents
- [RailEase - Train Booking System](#railease---train-booking-system)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [User Features](#user-features)
    - [Admin Features](#admin-features)
  - [Technologies Used](#technologies-used)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Development Tools](#development-tools)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
  - [API Endpoints](#api-endpoints)
  - [Screenshots](#screenshots)
  - [Contributing](#contributing)
  - [License](#license)

## Features

### User Features
- 🚉 **Train Search & Booking**
  - Search trains by route and date
  - View available classes and prices
  - Book tickets with passenger details
- 📱 **User Authentication**
  - Secure registration and login
  - JWT-based session management
- 🎫 **My Bookings**
  - View booking history
  - Filter bookings by status
  - Cancel upcoming journeys
- 🚦 **Live Train Status**
  - Check real-time train status
  - View route and schedule
- 📊 **Dashboard (Admin)**
  - View booking analytics
  - Revenue by class breakdown
  - Popular trains statistics

### Admin Features
- 👥 **User Management**
- 🚄 **Train & Schedule Management**
- 💰 **Revenue Reports**
- 📈 **Performance Analytics**

## Technologies Used

### Frontend
- HTML5, CSS3, JavaScript
- Chart.js for data visualization
- Font Awesome for icons
- Responsive design with Flexbox/Grid

### Backend
- Node.js with Express.js
- SQLite database (can be easily switched to MySQL/PostgreSQL)
- JWT for authentication
- Bcrypt for password hashing

### Development Tools
- Git for version control
- Postman for API testing
- NPM for package management

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/railease.git
   cd railease
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies (if any):
   ```bash
   cd public
   npm install  # if you have frontend package.json
   ```

## Configuration

1. Create a `.env` file in the root directory:
   ```env
   PORT=3001
   JWT_SECRET=your_strong_secret_key_here
   DATABASE_URL=./database.db
   ```

2. Adjust any other configuration in `server.js` as needed.

## Database Setup

Initialize the database with sample data:

```bash
node create-db.js
```

This will:
- Create all necessary tables
- Insert sample trains and classes
- Create an admin user (admin@example.com / password123)

## Running the Application

1. Start the backend server:
   ```bash
   node server.js
   ```

2. Open the frontend in your browser:
   - Open `public/index.html` directly
   - Or serve it using a local server (e.g., VS Code Live Server)

3. Access the application at:
   - User interface: `http://localhost:3001`
   - Admin dashboard: `http://localhost:3001/dashboard.html`

## API Endpoints

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/api/register` | POST | User registration | No |
| `/api/login` | POST | User login | No |
| `/api/trains` | GET | Get available trains | Optional |
| `/api/trains/:id` | GET | Get specific train details | Optional |
| `/api/bookings` | GET | Get user bookings | Yes |
| `/api/bookings` | POST | Create new booking | Yes |
| `/api/bookings/:id/cancel` | PUT | Cancel booking | Yes |

## Screenshots

![Booking Page](https://via.placeholder.com/600x400?text=Booking+Page)  
*Train booking interface*

![Dashboard](https://via.placeholder.com/600x400?text=Admin+Dashboard)  
*Admin analytics dashboard*

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

**RailEase** © 2023  
[Report Bug](https://github.com/yourusername/railease/issues) · 
[Request Feature](https://github.com/yourusername/railease/issues)
