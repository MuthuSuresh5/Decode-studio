const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

// Import routes
const serviceRoutes = require('./routes/service');
const UserRoutes = require('./routes/auth');
const OrderRoutes = require('./routes/order');
const ReviewRoutes = require('./routes/review');
const ContactRoutes = require('./routes/contact');
const AdminRoutes = require('./routes/users');

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'https://decode-studio-xzq1.vercel.app'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', UserRoutes);
app.use('/api/v1', serviceRoutes);
app.use('/api/v1', OrderRoutes);
app.use('/api/v1', ReviewRoutes);
app.use('/api/v1', ContactRoutes);
app.use('/api/admin', AdminRoutes);

module.exports = app;