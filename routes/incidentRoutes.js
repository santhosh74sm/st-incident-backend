const express = require('express');
const router = express.Router();

// Controllers Import
const {
    createIncident,
    getIncidents,
    updateIncidentStatus,
    deleteIncident
} = require('../controllers/incidentController');

const { getCategories, addCategory } = require('../controllers/categoryController');
const { getLocations, addLocation } = require('../controllers/locationController');

const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// ================= ROUTES =================

// 1️⃣ Categories
router.route('/categories')
    .get(protect, getCategories)
    .post(protect, authorize('Admin', 'Teacher'), addCategory);

// 2️⃣ Locations
router.route('/locations')
    .get(protect, getLocations)
    .post(protect, authorize('Admin', 'Teacher'), addLocation);

// 3️⃣ Create & Get Incidents
router.route('/')
    .post(
        protect,
        upload.single('image'),
        createIncident
    )
    .get(protect, getIncidents);

// 4️⃣ Update Status (Correct route for frontend)
router.patch(
    '/:id/status',
    protect,
    authorize('Admin', 'Teacher'),
    updateIncidentStatus
);

// 5️⃣ Delete Incident
router.delete(
    '/:id',
    protect,
    authorize('Admin', 'Teacher'),
    deleteIncident
);

module.exports = router;
