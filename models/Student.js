const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        admissionNo: {
            type: String,
            required: true,
            unique: true,   // Prevent duplicate admission numbers
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        className: {
            type: String,
            required: true,
            trim: true
        },
        section: {
            type: String,
            required: true,
            trim: true,
            uppercase: true   // Automatically store section in capital (A/B/C)
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
