const config = {
    db: {
        host: "db4free.net",
        user: "sanjaynithin",
        password: "sanjaynithin2002",
        database: "accredian_db",
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