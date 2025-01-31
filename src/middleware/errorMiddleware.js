class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      // Set status based on status code
      if (`${statusCode}`.startsWith('4')) {
        this.status = 'FAIL';
      } else if (`${statusCode}`.startsWith('5')) {
        this.status = 'ERROR';
      } else {
        this.status = 'SUCCESS';
      }
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
  };
  
  const handleDuplicateFieldsDB = (err) => {
    const value = err.meta?.target?.join(', ') || err.meta?.target;
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
  };
  
  const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
  };
  
  const handlePrismaError = (err) => {
    if (err.code === 'P2002') {
      return handleDuplicateFieldsDB(err);
    }
    if (err.code === 'P2025') {
      return new AppError('Record not found', 404);
    }
    if (err.code === 'P2003') {
      return new AppError('Invalid foreign key reference', 400);
    }
    return new AppError('Database operation failed', 500);
  };
  
  const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  };
  
  const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // Programming or other unknown error: don't leak error details
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'ERROR',
        message: 'Something went very wrong!'
      });
    }
  };
  
  const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'ERROR';
  
    if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
      let error = { ...err, message: err.message };
  
      // Handle Prisma errors
      if (error.name === 'PrismaClientKnownRequestError') {
        error = handlePrismaError(error);
      }
  
      // Handle other error types
      if (error.name === 'CastError') error = handleCastErrorDB(error);
      if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
      if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  
      sendErrorProd(error, res);
    }
  };
  
  module.exports = {
    errorHandler,
    AppError
  };