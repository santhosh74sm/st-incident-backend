const Location = require('../models/Location');

// @desc    Get all locations
// @route   GET /api/incidents/locations
// @access  Private
const getLocations = async (req, res) => {
    try {
        const locations = await Location.find().sort({ createdAt: -1 });
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new location
// @route   POST /api/incidents/locations
// @access  Private (Admin/Teacher)
const addLocation = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Please provide a location name' });
        }

        // Check if location already exists
        const locationExists = await Location.findOne({ name });
        if (locationExists) {
            return res.status(400).json({ message: 'Location already exists' });
        }

        const location = await Location.create({ name });
        res.status(201).json(location);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getLocations,
    addLocation
};