const express = require('express');
const logger = require('../middleware/loggerMiddleware');

const {
  localSignIn,
  googleSignIn,
  googleCallback,
  googleLogout
} = require('../controllers/authController');

const router = express.Router();

// localSignIn is the route for users to login using email and password with inhouse database (local strategy)
router.post('/local', logger, localSignIn);

// googleSignIn is the route for users to login using Google (OAuth strategy)
router.get('/google', googleSignIn);
router.get('/google/callback', googleCallback);
router.get('/google/logout', googleLogout);

module.exports = router;

