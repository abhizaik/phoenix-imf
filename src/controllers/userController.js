const prisma = require('../models/prismaClient');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Built-in Node.js crypto module
const { AppError } = require('../middleware/errorMiddleware');

// Helper function to hash password
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

// Helper function to verify password
const verifyPassword = (password, hashedPassword) => {
  const [salt, hash] = hashedPassword.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

exports.signup = async (req, res, next) => {
  try {
    const { name, password } = req.body;

    // Validate input
    if (!name || !password) {
      return next(new AppError('Please provide name and password', 400));
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { name }
    });

    if (existingUser) {
      return next(new AppError('User already exists', 400));
    }

    // Hash password using crypto
    const hashedPassword = hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        createdAt: true
      }
    });

    // Generate token
    const token = signToken(user.id);

    return res.status(201).json({
      message: 'User created successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { name, password } = req.body;

    // Validate input
    if (!name || !password) {
      return next(new AppError('Please provide name and password', 400));
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: { name }
    });

    // Verify password using crypto
    if (!user || !verifyPassword(password, user.password)) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Generate token
    const token = signToken(user.id);

    return res.json({
      message: 'Logged in successfully',
      data: {
        user: {
          id: user.id,
          name: user.name
        },
        token
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // Since JWT is stateless, we can't actually invalidate the token on the server
    // Best practice is to handle token invalidation on the client side
    // Here we'll just send a success response
    
    return res.json({
      message: 'Logged out successfully'
    });
  } catch (error) {
    return next(error);
  }
};
