// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 
require('./config/firebase-admin'); // Initialize Firebase Admin SDK

// Import routes
const userRoutes = require('./routes/userRoutes');
const addressRoutes = require('./routes/addressRoutes'); 
const productRoutes = require('./routes/productRoutes'); 
const orderRoutes = require('./routes/orderRoutes');     
const adminRoutes = require('./routes/adminRoutes');      

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// Enable CORS for all origins during development. Restrict in production.
app.use(cors({
  origin: ['https://vetmeet-admin-dashboard-ui.vercel.app'],  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json()); // Body parser for JSON data

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/addresses', addressRoutes); 
app.use('/api/products', productRoutes); 
app.use('/api/orders', orderRoutes);      
app.use('/api/admin', adminRoutes);      

// Simple root route for health check
app.get('/', (req, res) => {
  res.send('Vet&Meet Backend API is running!');
});

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


