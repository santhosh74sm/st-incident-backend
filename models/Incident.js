const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    // Title is required by backend, so we will use category as title if empty
    title: { type: String, required: true }, 
    description: { type: String },
    image: { type: String }, 
    
    // Enum-ah remove panniyachu, appo thaan 'fight' or 'New Type' accept aagum
    category: { 
        type: String, 
        required: true 
    },
    
    // Severity enum irukattum, aana default 'Low' kuduthukalam
    severity: { 
        type: String, 
        enum: ['Low', 'Medium', 'High'], 
        default: 'Low'
    },
    
    status: { 
        type: String, 
        enum: ['Open', 'In Progress', 'Closed'], 
        default: 'Open' 
    },

    // Frontend-la irunthu multiple names varuthu, so String Array-ah maathikalam
    studentsInvolved: [{ type: String }], 
    
    // Location field frontend-la irunthu varuthu, so ingayum add panniyachu
    location: { type: String },

    // Yaaru report pannathu?
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    actionTaken: { type: String },
    class: { type: String },
    section: { type: String } // Section-um sethukonga
}, { timestamps: true });

module.exports = mongoose.model('Incident', incidentSchema);