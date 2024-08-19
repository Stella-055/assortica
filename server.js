const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/failed', (req, res) => {
  
    res.sendFile(path.join(__dirname, 'failed.html'));
});
app.get('/success', (req, res) => {
  
    res.sendFile(path.join(__dirname, 'success.html'));
});
// Handle form submission
app.post('/contact', (req, res) => {
    const { firstname,secondname, email, message } = req.body;

    // Set up Nodemailer transporter
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,  // SMTP server
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',  
        auth: {
            user: process.env.SMTP_USER,  // SMTP server username
            pass: process.env.SMTP_PASS,  // SMTP server password
        },
        tls: {
            rejectUnauthorized: process.env.NODE_ENV !== 'development'}       
        })

    const mailOptions = {
        from: `"Assortica website" <${process.env.SMTP_USER}>`,  
        to: process.env.RECIPIENT_EMAIL,  
        subject: 'New Contact Form Submission',  
        text: `Name: ${firstname} ${secondname} \nEmail: ${email}\nMessage: ${message}`,  
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            
            res.redirect('/failed');
        }else{
           
            res.redirect('/success');
       }
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
