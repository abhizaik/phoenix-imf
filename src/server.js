require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
// const { swaggerUI, specs } = require('./utils/swagger');
const { errorHandler } = require('./middleware/errorMiddleware');
const successResponse = require('./middleware/responseMiddleware');
const userRoutes = require('./routes/userRoutes');
const gadgetRoutes = require('./routes/gadgetRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(successResponse);

// Routes
app.use('/api/v1', userRoutes);
app.use('/api/v1', gadgetRoutes);

// Documentation
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

// Error handling middleware should be the last middleware to use
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});