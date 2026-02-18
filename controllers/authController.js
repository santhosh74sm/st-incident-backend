const User = require('../models/User');
const Student = require('../models/Student');
const generateToken = require('../config/generateToken');

// @desc    Register new Staff (Admin/Teacher)
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    const { name, email, password, role, class: userClass } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'Staff email already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role, // Expecting 'Admin' or 'Teacher'
            class: userClass
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token (Staff + Student Login)
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, password, loginType } = req.body; 
    // loginType must be 'staff' or 'student'

    try {
        // ✅ 1. STAFF PORTAL LOGIC (Admin / Teacher)
        if (loginType === 'staff') {
            let user = await User.findOne({ email });

            if (user && (await user.matchPassword(password))) {
                return res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id),
                });
            }
            return res.status(401).json({ message: 'Invalid Staff Credentials' });
        }

        // ✅ 2. STUDENT PORTAL LOGIC (AdmissionNo + Password: ST + AdmissionNo)
        if (loginType === 'student') {
            // Find student by admissionNo (sent in 'email' field)
            const student = await Student.findOne({ admissionNo: email });
            const expectedPassword = `ST${email}`; // Logic: ST + 1001

            if (student && password === expectedPassword) {
                return res.json({
                    _id: student._id,
                    name: student.name,
                    role: 'Student', // Forced student role
                    admissionNo: student.admissionNo,
                    className: student.className,
                    section: student.section,
                    token: generateToken(student._id),
                });
            }
            return res.status(401).json({ message: 'Invalid Student ID or Password' });
        }

        // Error if loginType is missing or wrong
        res.status(400).json({ message: 'Login type (staff/student) must be specified' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (Staff only - Admin access)
// @route   GET /api/auth/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Delete Staff Member
// @route   DELETE /api/auth/users/:id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'Staff member removed' });
        } else {
            res.status(404).json({ message: 'Staff member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    deleteUser
};