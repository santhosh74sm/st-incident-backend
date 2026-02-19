const Student = require('../models/Student');
const XLSX = require('xlsx');
const path = require('path');

// @desc    Bulk Upload Students
const uploadStudents = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // விண்டோஸ் பாத் பிரச்சனையைத் தவிர்க்க Absolute Path பயன்படுத்துகிறோம்
        const filePath = path.resolve(req.file.path);

        // 1. எக்செல் ஃபைலை ரீட் செய்யவும்
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (data.length === 0) {
            return res.status(400).json({ message: "Excel sheet is empty" });
        }

        // 2. டேட்டாவை சேமிக்கவும்
        const uploadPromises = data.map(async (row) => {
            const admissionNo = row.admissionNo || row.AdmissionNo;
            const name = row.name || row.Name;
            const classVal = row.class || row.Class || row.className;
            const section = row.section || row.Section;

            if (!admissionNo || !name) return;

            return Student.findOneAndUpdate(
                { admissionNo: admissionNo.toString() },
                { 
                    name, 
                    className: classVal.toString(), 
                    section: section ? section.toString().toUpperCase() : 'A' 
                },
                { upsert: true, new: true }
            );
        });

        await Promise.all(uploadPromises);
        res.status(200).json({ message: "Student database synced successfully!" });

    } catch (error) {
        console.error("Upload Logic Error:", error);
        res.status(500).json({ message: "File processing error: " + error.message });
    }
};

// மற்ற பங்க்ஷன்கள் (கீழே உள்ளவற்றை மாற்ற வேண்டாம், அப்படியே இருக்கட்டும்)
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({}).sort({ className: 1, name: 1 });
        res.json(students);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const getStudentsByFilter = async (req, res) => {
    const { className, section } = req.query;
    let query = {};
    if (className) query.className = className;
    if (section) query.section = section;
    try {
        const students = await Student.find(query).sort({ name: 1 });
        res.json(students);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const getFilters = async (req, res) => {
    try {
        const classes = await Student.distinct('className');
        const sections = await Student.distinct('section');
        res.json({ 
            classes: classes.filter(c => c).sort((a,b) => a-b), 
            sections: sections.filter(s => s).sort() 
        });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteStudent = async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student removed' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const createStudent = async (req, res) => {
    try {
        const { name, admissionNo, className, section } = req.body;
        const exists = await Student.findOne({ admissionNo });
        if (exists) return res.status(400).json({ message: "Admission No already exists!" });
        const student = await Student.create({ name, admissionNo, className, section: section.toUpperCase() });
        res.status(201).json(student);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { uploadStudents, getAllStudents, getStudentsByFilter, getFilters, deleteStudent, createStudent };