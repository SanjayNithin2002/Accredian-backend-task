const config = {
    db: {
        host: "db4free.net",
        user: "sanjaynithin",
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectTimeout: 60000,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10, 
        idleTimeout: 60000,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    },
    listPerPage: 10,
};

module.exports = config;