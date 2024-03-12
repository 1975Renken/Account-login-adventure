console.log('Server starting...');

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

// Create a transporter using SMTP settings for Gmail (as shown in the previous response)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'eaglesroostresort.dev@gmail.com',
      pass: 'anfq corl qidp qqrp',
    },
  });


// Middleware to parse JSON requests
app.use(bodyParser.json());


// Enable CORS for all routes
app.use(cors({
    origin: 'http://127.0.0.1:8080',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 204,
}));


// Create MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Summer2023!!',
    database: 'users',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});



// Existing route for creating an account
app.post('/api/createAccount', async (req, res) => {
    console.log('Received a account request:', req.body);
    const { username, email, password } = req.body;

    try {
        // Check if the email is already in use
        const [emailCheck] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (emailCheck.length > 0) {
            // Email is already in use
            return res.status(400).json({ error: 'Email is already in use' });
        }

        // Check if the username is already in use
        const [usernameCheck] = await pool.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (usernameCheck.length > 0) {
            // Username is already in use
            return res.status(400).json({ error: 'Username is already in use' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the user into the database with the hashed password
        const [results, fields] = await pool.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//Existing route for logging in
app.post('/api/login', async (req, res) => {
    console.log('Received a login request:', req.body);
    const { username, password } = req.body;

    // Retrieve hashed password from the database
    const [results] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
    );

    if (results.length === 1) {
        const hashedPassword = results[0].password;

        // Compare entered password with the hashed password
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (passwordMatch) {
            // Passwords match, user is authenticated
            res.json({ message: 'Login successful' });
        } else {
            // Incorrect password
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } else {
        // User not found
        res.status(404).json({ message: 'User not found' });
    }
});


// Endpoint to handle forgot password requests
app.post('/api/forgotPassword', (req, res) => {
    const { email } = req.body;
  
    // Generate reset token and reset link
    const resetToken = generateResetToken();
    const resetLink = `http://localhost:8080/resetPassword.html?token=${resetToken}`;
  
    // Send reset link to the provided email
    const mailOptions = {
      from: 'eaglesroostresort.dev@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${resetLink}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log('Email sent:', info.response);
        res.json({ message: 'Email sent successfully' });
      }
    });
  });
  

// Function to generate a random reset token
function generateResetToken() {
    const length = 20;
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    
    for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
return token;
}
 
  
// ... other routes and configurations ...


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});