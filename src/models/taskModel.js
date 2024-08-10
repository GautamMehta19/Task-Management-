const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Incomplete', 'In Progress', 'Completed'],
        default: 'Incomplete'
    },
    pdfPath: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Task', taskSchema);
