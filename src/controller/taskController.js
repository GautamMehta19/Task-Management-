const taskModel = require('../models/taskModel');

const getTasks = async (req, res) => {
    try {
        const tasks = await taskModel.find();
        return res.status(200).json(tasks);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Error fetching tasks',
            error
        });
    }
};

const createTask = async (req, res) => {
    try {
        const savedTask = await taskModel.create(req.body);
        return res.status(201).json(savedTask);
    }
    catch (error) {
        return res.status(400).json({
            message: 'Error creating task',
            error
        });
    }
};

const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const updatedTask = await taskModel.findByIdAndUpdate(taskId, req.body, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        return res.status(200).json(updatedTask);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Error updating task',
            error
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        await taskModel.findByIdAndDelete(req.params.id);
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({
            message: 'Error deleting task',
            error
        });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
}