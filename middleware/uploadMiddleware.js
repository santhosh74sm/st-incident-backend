const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. 'uploads' போல்டரைத் துல்லியமாக உருவாக்கவும்
const uploadDir = path.join(__dirname, '..', 'uploads'); // backend/uploads போல்டர்

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Uploads folder ensured at:', uploadDir);
}

// 2. Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // துல்லியமான பாத் (Absolute Path)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// 3. File filter
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = [
        'image/jpeg', 
        'image/jpg', 
        'image/png', 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel' // .xls
    ];

    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type!'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

module.exports = upload;