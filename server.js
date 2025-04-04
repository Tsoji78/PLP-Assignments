const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// SQLite database setup
const db = new sqlite3.Database('roadease.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to SQLite database.');
});

// Initialize database tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        departure_date TEXT NOT NULL,
        class TEXT NOT NULL,
        status TEXT DEFAULT 'Pending',
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
});

// API Routes
// Login
app.post('/api/login', (req, res) => {
    const { email_or_phone, password } = req.body;
    db.get(`SELECT * FROM users WHERE (email = ? OR phone = ?) AND password = ?`, 
        [email_or_phone, email_or_phone, password], 
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (row) {
                res.json({ success: true, user: { id: row.id, full_name: row.full_name } });
            } else {
                res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        });
});

// Register
app.post('/api/register', (req, res) => {
    const { full_name, email, phone, password } = req.body;
    db.run(`INSERT INTO users (full_name, email, phone, password) VALUES (?, ?, ?, ?)`, 
        [full_name, email, phone, password], 
        function(err) {
            if (err) return res.status(400).json({ error: 'Email or phone already exists' });
            res.json({ success: true, message: 'Registration successful' });
        });
});

// Get User Bookings
app.get('/api/bookings/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    db.all(`SELECT * FROM bookings WHERE user_id = ?`, [user_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Book a Ticket
app.post('/api/book-ticket', (req, res) => {
    const { user_id, origin, destination, departure_date, class: travel_class } = req.body;
    db.run(`INSERT INTO bookings (user_id, origin, destination, departure_date, class) VALUES (?, ?, ?, ?, ?)`, 
        [user_id, origin, destination, departure_date, travel_class], 
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'Ticket booked successfully' });
        });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});