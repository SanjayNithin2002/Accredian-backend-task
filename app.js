const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000;
const userRoutes = require('./api/routes/Users');
// Middleware

// for detailed logging
app.use(morgan('dev'));
// for parsing JSON req body. 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
// Handling CORS
app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
        res.header(
            "Access-Control-Allow-Methods",
            "PUT, POST, PATCH, DELETE, GET"
        );
        return res.status(200).json({});
    }
    next();
});

// Routes
app.use('/', userRoutes);

// handling errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            status: error.status || 500
        }
    });
});

// express server is listening at port 3000
app.listen(port, () => {
    console.log(`Server is listening at port:${port}`);
})

