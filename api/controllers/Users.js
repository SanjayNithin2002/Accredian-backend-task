exports.signup = (req, res) => {
    res.status(201).json({
        message: 'Server says hi from "/signup" route',
    });
};

exports.login = (req, res) => {
    res.status(201).json({
        message: 'Server says hi from "/login" route',
    });
}