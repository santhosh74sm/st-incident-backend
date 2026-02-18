const Student = require('../models/Student');
const XLSX = require('xlsx');

// @desc    Add single student manually
// @route   POST /api/students
const createStudent = async (req, res) => {
    try {
        const { name, admissionNo, className, section } = req.body;

        const exists = await Student.findOne({ admissionNo });
        if (exists) {
            return res.status(400).json({ message: "Admission Number already exists!" });
        }

        const student = await Student.create({
            name,
            admissionNo,
            className,
            section: section.toUpperCase()
        });

        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Bulk Upload Students
const uploadStudents = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const uploadPromises = data.map(async (row) => {
            const admissionNo = row.admissionNo || row.AdmissionNo;
            const name = row.name || row.Name;
            const classVal = row.class || row.Class || row.className;
            const section = row.section || row.Section;
            if (!admissionNo || !name) return;

            return Student.findOneAndUpdate(
                { admissionNo: admissionNo.toString() },
                { name, className: classVal.toString(), section: section.toString().toUpperCase() },
                { upsert: true, new: true }
            );
        });
        await Promise.all(uploadPromises);
        res.status(200).json({ message: "Database synced successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({}).sort({ name: 1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStudentsByFilter = async (req, res) => {
    const { className, section } = req.query;
    let query = {};
    if (className) query.className = className;
    if (section) query.section = section;
    try {
        const students = await Student.find(query).sort({ name: 1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFilters = async (req, res) => {
    try {
        const classes = await Student.distinct('className');
        const sections = await Student.distinct('section');
        res.json({ classes: classes.sort((a,b)=>a-b), sections: sections.sort() });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    createStudent, // ✅ Exported
    uploadStudents, 
    getAllStudents, 
    getStudentsByFilter, 
    getFilters, 
    deleteStudent 
};