const express = require('express');
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');
const Task = require('../models/taskModel');
const taskController = require('../controller/taskController');

const router = express.Router();

// Define Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Set the destination to the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append the current timestamp to the original filename
    }
});

// File Filter Function to Allow Specific File Types
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
        'application/pdf',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    console.log(`File MIME Type: ${mimetype}`);
    console.log(`File Extension: ${extname}`);

    if (allowedTypes.includes(mimetype) || ['.xlsx', '.xls', '.csv', '.pdf', '.txt', '.docx'].includes(extname)) {
        cb(null, true);
    } else {
        cb(new Error('Error: File type not supported!'));
    }
};

// Multer Configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
}).single('file');

// Task Routes
router.get('/tasks', taskController.getTasks);
router.post('/tasks', taskController.createTask);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

// File Upload Route
router.post('/upload', upload, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase();

        if (ext === '.xlsx' || ext === '.xls') {
            // Process Excel file
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet);

            if (!data.length) {
                return res.status(400).json({ message: 'Excel file is empty or improperly formatted' });
            }

            const transformedData = data.map(task => ({
                title: task.title || 'Untitled Task',
                description: task.description || 'No description',
                status: task.status || 'Pending',
            }));

            const tasks = await Task.insertMany(transformedData);
            return res.json({ message: 'File uploaded and tasks saved successfully', data: tasks });
        } else {
            // Handle other file types (e.g., PDFs, CSVs, DOCXs, etc.)
            const fileContent = fs.readFileSync(filePath, 'utf8');
            // Save file details or perform other necessary operations
            return res.json({ message: 'File uploaded successfully', filePath: filePath });
        }
    } catch (error) {
        console.error('Error uploading and processing file:', error);
        res.status(500).json({ message: 'Error uploading and processing file', error });
    }
});

module.exports = router;
