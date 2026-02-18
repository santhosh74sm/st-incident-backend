const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a location name'],
        unique: true,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Location', locationSchema);