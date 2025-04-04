const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const SECRET_KEY = '781227zzxyz';

app.use(cors());
app.use(bodyParser.json());

// Initialize database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Create tables if they don't exist
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS trains (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      number TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      source TEXT NOT NULL,
      destination TEXT NOT NULL,
      departure_time TEXT NOT NULL,
      arrival_time TEXT NOT NULL,
      duration TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      train_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      seats INTEGER NOT NULL,
      FOREIGN KEY (train_id) REFERENCES trains(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pnr TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL,
      train_id INTEGER NOT NULL,
      class_id INTEGER NOT NULL,
      journey_date TEXT NOT NULL,
      passengers INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'confirmed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (train_id) REFERENCES trains(id),
      FOREIGN KEY (class_id) REFERENCES classes(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS passenger_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      FOREIGN KEY (booking_id) REFERENCES bookings(id)
    )`);
  });
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      function(err) {
        if (err) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(201).json({ id: this.lastID });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    try {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { id: user.id, email: user.email },
          SECRET_KEY,
          { expiresIn: '24h' }
        );
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

// Train Routes
app.get('/api/trains', (req, res) => {
  const { source, destination, date } = req.query;
  
  let query = `
    SELECT t.*, 
      GROUP_CONCAT(c.id) AS class_ids,
      GROUP_CONCAT(c.name) AS class_names,
      GROUP_CONCAT(c.price) AS class_prices,
      GROUP_CONCAT(c.seats) AS class_seats
    FROM trains t
    LEFT JOIN classes c ON t.id = c.train_id
  `;
  
  const params = [];
  
  if (source && destination) {
    query += ' WHERE t.source = ? AND t.destination = ?';
    params.push(source, destination);
  }
  
  query += ' GROUP BY t.id';
  
  db.all(query, params, (err, trains) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const formattedTrains = trains.map(train => ({
      ...train,
      classes: train.class_ids.split(',').map((id, index) => ({
        id: parseInt(id),
        name: train.class_names.split(',')[index],
        price: parseFloat(train.class_prices.split(',')[index]),
        seats: parseInt(train.class_seats.split(',')[index])
      }))
    }));
    
    res.json(formattedTrains);
  });
});

// Booking Routes
app.post('/api/bookings', authenticateToken, (req, res) => {
  const { train_id, class_id, journey_date, passengers, passenger_details, total_amount } = req.body;
  const pnr = 'PNR' + Math.floor(100000 + Math.random() * 900000);
  
  db.serialize(() => {
    db.run(
      'INSERT INTO bookings (pnr, user_id, train_id, class_id, journey_date, passengers, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [pnr, req.user.id, train_id, class_id, journey_date, passengers, total_amount],
      function(err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        
        const bookingId = this.lastID;
        const passengerStmt = db.prepare(
          'INSERT INTO passenger_details (booking_id, name, age, gender) VALUES (?, ?, ?, ?)'
        );
        
        passenger_details.forEach(passenger => {
          passengerStmt.run([bookingId, passenger.name, passenger.age, passenger.gender]);
        });
        
        passengerStmt.finalize(err => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.status(201).json({ pnr, bookingId });
        });
      }
    );
  });
});

app.get('/api/bookings', authenticateToken, (req, res) => {
  const query = `
    SELECT b.*, t.name AS train_name, t.number AS train_number, 
           t.source, t.destination, c.name AS class_name
    FROM bookings b
    JOIN trains t ON b.train_id = t.id
    JOIN classes c ON b.class_id = c.id
    WHERE b.user_id = ?
    ORDER BY b.journey_date DESC
  `;
  
  db.all(query, [req.user.id], (err, bookings) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (bookings.length === 0) {
      return res.json([]);
    }
    
    const bookingIds = bookings.map(b => b.id).join(',');
    db.all(
      `SELECT booking_id, name, age, gender FROM passenger_details 
       WHERE booking_id IN (${bookingIds})`,
      (err, passengers) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        const bookingsWithPassengers = bookings.map(booking => ({
          ...booking,
          passenger_details: passengers.filter(p => p.booking_id === booking.id)
        }));
        
        res.json(bookingsWithPassengers);
      }
    );
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});