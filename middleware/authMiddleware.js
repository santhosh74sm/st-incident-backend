const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Staff/Admin/Teacher check
            let user = await User.findById(decoded.id).select('-password');
            
            // Student check
            if (!user) {
                user = await Student.findById(decoded.id);
                if (user) user.role = 'Student'; 
            }

            if (!user) return res.status(401).json({ message: 'User not found' });

            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Role (${req.user?.role}) is not authorized to access this resource`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };