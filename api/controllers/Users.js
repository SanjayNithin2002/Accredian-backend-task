/* eslint-disable no-unused-vars */
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
        // throwing an 409 error if the username or email already exists.
        if (results.length > 0) {
            const error = new Error('Username or Email already exists.');
            error.status = 409;
            throw error;
        } else {
            const [results] = await connection.execute(
                'INSERT INTO `Users` VALUES (?, ?, ?)',
                [data.username, data.email, data.password],
            );
            return {
                message: 'User created successfully',
                token: 'N/A'
            }
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
            if (results[0].password == data.password) {
                return {
                    message: 'User Authenticated',
                    token: 'N/A'
                }
            } else {
                const error = new Error('Invalid Password');
                error.status= 401;
                throw error;
            }
        }
    } catch (error) {
        console.error('Error in login:', error.message);
        throw error;
    }
}

exports.signup = async (req, res) => {
    try {
        const result = await signupService(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message
        })
    }
};

exports.login = async (req, res) => {
    try {
        const result = await loginService(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message
        })
    }
}