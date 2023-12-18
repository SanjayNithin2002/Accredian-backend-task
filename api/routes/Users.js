const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/Users');

// handling signup and login requests.
router.post('/signup', userControllers.signup);
router.post('/login', userControllers.login);

module.exports = router;