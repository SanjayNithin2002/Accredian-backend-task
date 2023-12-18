/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');
const config = require('../../config');
const pool = mysql.createPool(config.db);
const connection = pool.promise();

// regex function to check whether a string is email
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// signup handler fucntion
const signupService = async (data) => {
    try {
        // checking whether username or email already exists. 
        const [results] = await connection.execute(
            'SELECT * FROM `Users` where `email` = ? or `username` = ?',
            [data.email, data.username]
        );
        console.log(results);
        // throwing an 409 error if the username or email already exists.
        if (results.length > 0) {
            const error = new Error('Username or Email already exists.');
            error.status = 409;
            throw error;
        } else {
            // hashing password using bcrypt before storing
            const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(data.password, 10, (err, hash) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            });
            const [results] = await connection.execute(
                'INSERT INTO `Users` VALUES (?, ?, ?)',
                [data.username, data.email, hashedPassword],
            );
            return 'User created successfully'
        }
    } catch (error) {
        console.error('Error in signup:', error.message);
        throw error;
    }
};

const loginService = async (data) => {
    try {
        const user = isValidEmail(data.user) ? 'email' : 'username';
        const [results] = await connection.execute(
            `SELECT * FROM \`Users\` WHERE \`${user}\` = ?`,
            [data.user]
        );
        if (results.length === 0) {
            const error = new Error("User doesn't exist.");
            error.status = 404;
            throw error;
        } else {
            const isValidPassword = await new Promise((resolve, reject) => {
                bcrypt.compare(data.password, results[0].password, (err, response) => {
                    if (err) {
                        reject('Auth Failed');
                    }
                    resolve(response);
                });
            })
            if (isValidPassword) {
                return 'User Authenticated'
            } else {
                const error = new Error('Invalid Password');
                error.status = 401;
                throw error;
            }
        }
    } catch (error) {
        console.error('Error in login:', error.message);
        throw error;
    }
}

const changePasswordService = async (data) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(data.password, 10, (err, hash) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });
        const [results] = await connection.execute(
            'UPDATE `Users` SET `password` = ? WHERE `email` = ?' ,
            [hashedPassword, data.email]
        );
        return 'Password changed successfully'
    } catch (error) {
        console.error('Error in change-password:', error.message);
        throw error;
    }
}


exports.signup = async (req, res) => {
    try {
        const result = await signupService(req.body);
        console.log(result);
        res.status(201).json({
            message: result
        });
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message
        })
    }
};

exports.login = async (req, res) => {
    try {
        const result = await loginService(req.body);
        res.status(201).json({
            message: result
        });
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message
        })
    }
};

exports.sendOTP = async (req, res) => {
    try {
        const [results] = await connection.execute(
            'SELECT * FROM `Users` WHERE `email` = ?',
            [req.body.email]
        );
        if (results.length > 0) {
            const generatedOTP = Math.floor(100000 + Math.random() * 900000);
            const mailOptions = {
                from: 'backend.server@mail.com',
                to: req.body.email,
                subject: 'OTP to Change your Password',
                text: `
            Hello, 
            
            You have requested to change your password. Please use the following OTP (One-Time Password) to complete the process:
            
            OTP: ${generatedOTP}
            
            If you didn't request this change, please ignore this email.
            
            Thank you,
            Accredian-Backend-Task
            `
            };
            var transporter = nodemailer.createTransport({
                service: process.env.MAIL_SERVER || 'gmail',
                auth: {
                    user: process.env.NODEMAIL,
                    pass: process.env.NODEMAIL_PASSWORD
                }
            }).sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error in send-otp:', error.message);
                    res.status(500).json({
                        error: "Error sending OTP",
                    })
                } else {
                    res.status(201).json({
                        message: "OTP sent successfully",
                        otp: generatedOTP
                    });
                }
            });
        } else {
            res.status(404).json({
                error: "Email doesn't exist."
            });
        }
    } catch (error) {
        console.error('Error in send-otp:', error.message);
        res.status(error.status || 500).json({
            error: error.message
        });
    }
};

exports.changePassword = async (req, res) => {
    try{
        const result = await changePasswordService(req.body);
        res.status(200).json({
            message: result
        });
    }catch(error){
        res.status(error.status || 500).json({
            error: error.message
        });
    }
}