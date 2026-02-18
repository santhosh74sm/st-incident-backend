const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `excel-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File filter (Allow only Excel files)
const fileFilter = (req, file, cb) => {
    // Only allow .xlsx and .xls
    if (file.originalname.match(/\.(xlsx|xls)$/)) {
        cb(null, true);
    } else {
        cb(new Error('Please upload only Excel files (.xlsx or .xls)'));
    }
};

const excelUpload = multer({
    storage,
    fileFilter
});

module.exports = excelUpload;