import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import client from './client.js';
import csrf from 'csrf';
import cookieParser from 'cookie-parser';

const csrfProtection = csrf({ cookie: true });
const router = express.Router();

// Enable parsing of JSON bodies
router.use(bodyParser.json());

// Enable parsing of URL-encoded bodies
router.use(bodyParser.urlencoded({ extended: true }));

// Enable parsing of cookies
router.use(cookieParser());

// Log requests
router.use(morgan('tiny'));

// Apply CSRF protection middleware
router.use(csrfProtection);

// Add CSRF token to every response
router.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

// Handle CSRF token validation failure
router.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({ message: 'Invalid CSRF token' });
  } else {
    next(err);
  }
});

export default router;
