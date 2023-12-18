const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/Users');

// handling signup and login requests.
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome Accredian-Backend-Task Web Server'
    });
});
router.post('/signup', userControllers.signup);
router.post('/login', userControllers.login);

module.exports = router;