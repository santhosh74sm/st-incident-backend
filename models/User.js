const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['Admin', 'Teacher', 'Student', 'Parent'], 
        required: true 
    },
    // Student-ku mattum: entha class?
    class: { type: String },
    // Student-ku mattum: avunga parent ID
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Parent-ku mattum: avunga kuttigalin ID list
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

// Password-ah save pannum munnadi encrypt (Hash) panna:
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Login pannum pothu password correct-ah nu check panna:
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);