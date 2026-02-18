const Incident = require('../models/Incident');

// @desc    Create a new incident
const createIncident = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            category, 
            severity, 
            studentsInvolved, 
            class: studentClass, 
            section, 
            location 
        } = req.body;

        const incident = new Incident({
            title: title || category,
            description,
            category,
            severity,
            class: studentClass,
            section,
            location,

            // ✅ Ensure always array
            studentsInvolved: Array.isArray(studentsInvolved)
                ? studentsInvolved
                : studentsInvolved
                ? [studentsInvolved]
                : [],

            reportedBy: req.user._id,

            // ✅ Fix Windows path issue
            image: req.file 
                ? req.file.path.replace(/\\/g, "/") 
                : null
        });

        const createdIncident = await incident.save();
        res.status(201).json(createdIncident);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all incidents (Role-based filtering)
const getIncidents = async (req, res) => {
    try {
        let incidents;

        const populateQuery = { 
            path: 'reportedBy', 
            select: 'name role' 
        };

        // ✅ Admin / Teacher -> See All Incidents
        if (req.user.role === 'Admin' || req.user.role === 'Teacher') {

            incidents = await Incident.find()
                .populate(populateQuery)
                .sort({ createdAt: -1 });

        } 
        // ✅ Student -> Only incidents where their name exists in studentsInvolved array
        else if (req.user.role === 'Student') {

            incidents = await Incident.find({
                studentsInvolved: { $in: [req.user.name] }
            })
                .populate(populateQuery)
                .sort({ createdAt: -1 });

        } 
        // Optional fallback (if any other role)
        else {
            incidents = [];
        }

        res.json(incidents);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update status
const updateIncidentStatus = async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id);

        if (incident) {
            incident.status = req.body.status || incident.status;
            incident.actionTaken = req.body.actionTaken || incident.actionTaken;

            const updatedIncident = await incident.save();
            res.json(updatedIncident);
        } else {
            res.status(404).json({ message: 'Incident not found' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete incident (Admin/Teacher only)
const deleteIncident = async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id);

        if (incident) {
            await incident.deleteOne();
            res.json({ message: 'Incident removed' });
        } else {
            res.status(404).json({ message: 'Incident not found' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    createIncident, 
    getIncidents, 
    updateIncidentStatus, 
    deleteIncident 
};
