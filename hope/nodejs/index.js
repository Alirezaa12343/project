const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(express.json()); // Use express built-in middleware

// In a real application, consider using a database
let userVerificationCodes = {};
let userPasswords = {};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL, // Use environment variable for your email
    pass: process.env.PASSWORD // Use environment variable for your password
  }
});

app.post('/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send({ message: 'Email is required' });
  }
  
  // Check if the email ends with @aua.am
  if (!email.endsWith('@aua.am')) {
    return res.status(400).send({ message: 'Email must be a valid AUA email address' });
  }

  // Generate and send a verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code
  userVerificationCodes[email] = verificationCode;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your Verification Code',
    text: `Your verification code is: ${verificationCode}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send({ message: 'Failed to send verification code' });
    }
    console.log('Verification code sent: ' + info.response);
    res.send({ message: 'Verification code sent to your email' });
  });
});

// Endpoint to verify code and set password
app.post('/verify-and-set-password', (req, res) => {
  const { email, verificationCode, password } = req.body;
  if (!email || !verificationCode || !password) {
    return res.status(400).send({ message: 'Email, verification code, and password are required' });
  }
  
  if (userVerificationCodes[email] === verificationCode) {
    // Assuming you would hash the password before storing it in a real application
    userPasswords[email] = password; // Store or update the password for the user
    delete userVerificationCodes[email]; // Remove the verification code once used
    res.send({ message: 'Password set successfully' });
  } else {
    res.status(400).send({ message: 'Invalid verification code' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
