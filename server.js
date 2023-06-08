import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

const app = express();
const router = express.Router();

// Enable parsing of JSON bodies
app.use(bodyParser.json());

// Enable parsing of URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Enable parsing of cookies
app.use(cookieParser());

// Log requests
app.use(morgan('tiny'));

// Apply CSRF protection middleware
app.use(csrf({ cookie: true }));

// Add CSRF token to every response
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

// RESTful API endpoints
router.get('/', (req, res) => {
  // Handle GET request
});

router.post('/', (req, res) => {
  // Handle POST request
});

// ... other routes

// Mount the router on a specific path
app.use('/', router);

// Handle CSRF token validation failure
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({ message: 'Invalid CSRF token' });
  } else {
    next(err);
  }
});

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
