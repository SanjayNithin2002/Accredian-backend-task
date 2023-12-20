const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/Users');
const cors = require('cors');
// handling signup and login requests.
router.use(cors());
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome Accredian-Backend-Task Web Server'
    });
});

router.post('/signup', userControllers.signup);
router.post('/login', userControllers.login);
router.post('/sendotp', userControllers.sendOTP);
router.patch('/changepassword', userControllers.changePassword);

module.exports = router;