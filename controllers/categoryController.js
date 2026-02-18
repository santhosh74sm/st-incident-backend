const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/incidents/categories
// @access  Private
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new category
// @route   POST /api/incidents/categories
// @access  Private (Admin/Teacher)
const addCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Please provide a category name' });
        }

        // Check if category already exists
        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await Category.create({ name });
        res.status(201).json(category);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getCategories,
    addCategory
};