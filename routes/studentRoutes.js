const express = require('express');
const router = express.Router();
const { 
    createStudent, // ✅ Correctly Imported
    uploadStudents, 
    getAllStudents, 
    getStudentsByFilter, 
    getFilters, 
    deleteStudent 
} = require('../controllers/studentController');

const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// 1. Manual Add Student (Single)
router.post('/', protect, authorize('Admin', 'Teacher'), createStudent);

// 2. Bulk Upload (Excel)
router.post('/upload', protect, authorize('Admin', 'Teacher'), upload.single('file'), uploadStudents);

// 3. Dropdown Filters
router.get('/filters', protect, getFilters);

// 4. Filter Students
router.get('/filter', protect, getStudentsByFilter);

// 5. All Students
router.get('/all', protect, getAllStudents);

// 6. Delete Student
router.delete('/:id', protect, authorize('Admin', 'Teacher'), deleteStudent);

module.exports = router;