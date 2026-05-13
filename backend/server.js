const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend Running');
});

// Test database connection
app.get('/test-db' ,(req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// Create a new user
app.post('/users' , (req, res) => {
    const { username, phone, email, roles, password } = req.body;
    const sql = `INSERT INTO users (username, phone, email, roles, password) VALUES (?, ?, ?, ?, ?)`;
    
    db.query(sql, [username, phone, email, roles, password], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        } else {
            res.json({message: 'User created successfully', result: results });
            }
        }
    );
});

// Get all users
app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// Get user by ID
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM users WHERE id_users = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
                res.json(results);
            }
        }
    );
});

// Update user by ID
app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const { username, phone, email, roles, password } = req.body;
    const sql = 'UPDATE users SET username = ?, phone = ?, email = ?, roles = ?, password = ? WHERE id_users = ?';
    db.query(sql, [username, phone, email, roles, password, id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'User updated successfully', result: results });
        }
    });
});

// Delete user by ID
app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM users WHERE id_users = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'User deleted successfully', result: results });
        }
    });
});

//Login API
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            if (results.length > 0) {
                res.json({ message: 'Login successful', user: results[0] });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        }
    });
});


app.listen(5000, () => {
    console.log('Server running on port 5000');
});