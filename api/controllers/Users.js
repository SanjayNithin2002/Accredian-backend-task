/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const config = require('../../config');
const pool = mysql.createPool(config.db);
const connection = pool.promise();

// regex function to check whether a string is email
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// hashing password using bcrypt


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
            console.log(hashedPassword);
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
                    if(err){
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
}