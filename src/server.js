require('dotenv').config();
const express = require('express');
const { errorHandler } = require('./middleware/errorMiddleware');
const successResponse = require('./middleware/responseMiddleware');
const userRoutes = require('./routes/userRoutes');
const gadgetRoutes = require('./routes/gadgetRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(successResponse);

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Accessing the unknown. Only those who seek, shall find.'
  });
});
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1', gadgetRoutes);

// Error handling middleware 
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});