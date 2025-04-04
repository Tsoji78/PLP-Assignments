const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Create tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Trains table
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

  // Classes table
  db.run(`CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    seats INTEGER NOT NULL,
    FOREIGN KEY (train_id) REFERENCES trains(id)
  )`);

  // Bookings table
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

  // Passenger details table
  db.run(`CREATE TABLE IF NOT EXISTS passenger_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
  )`);

  // Insert sample data
  db.run(`INSERT OR IGNORE INTO users (name, email, password) VALUES 
    ('Admin User', 'admin@example.com', '$2b$10$examplehashedpassword')`);

  // Sample trains
  db.run(`INSERT OR IGNORE INTO trains (number, name, source, destination, departure_time, arrival_time, duration) VALUES 
    ('12302', 'Rajdhani Express', 'Delhi', 'Mumbai', '16:35', '08:15', '15h 40m'),
    ('12952', 'Mumbai Rajdhani', 'Delhi', 'Mumbai', '16:55', '08:45', '15h 50m'),
    ('12954', 'Shatabdi Express', 'Delhi', 'Mumbai', '06:15', '14:25', '8h 10m'),
    ('12310', 'Duronto Express', 'Delhi', 'Mumbai', '22:40', '11:30', '12h 50m')`);

  // Sample classes
  db.run(`INSERT OR IGNORE INTO classes (train_id, name, price, seats) VALUES
    (1, 'AC 2 Tier (2A)', 2920, 50),
    (1, 'AC 3 Tier (3A)', 2015, 80),
    (1, 'Sleeper (SL)', 1210, 120),
    (2, 'AC First Class (1A)', 4955, 20),
    (2, 'AC 2 Tier (2A)', 2920, 40),
    (2, 'AC 3 Tier (3A)', 2015, 60),
    (3, 'Executive Class (EC)', 3465, 30),
    (3, 'Chair Car (CC)', 1860, 50),
    (4, 'AC 2 Tier (2A)', 2920, 45),
    (4, 'AC 3 Tier (3A)', 2015, 70),
    (4, 'Sleeper (SL)', 1210, 100)`);

  console.log('Database initialized with sample data');
});

db.close();