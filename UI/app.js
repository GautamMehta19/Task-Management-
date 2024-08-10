document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const taskForm = document.getElementById('task-form');
    const taskTitle = document.getElementById('task-title');
    const taskDescription = document.getElementById('task-description');
    const taskStatus = document.getElementById('task-status');
    const uploadForm = document.getElementById('upload-form');
    const fileInput = document.getElementById('file');
    let editMode = false;
    let currentTaskId = null;

    // Fetch tasks and render them
    async function fetchTasks() {
        try {
            const response = await fetch('http://localhost:3000/api/tasks');
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    function renderTasks(tasks) {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.setAttribute('data-id', task._id);

            const taskContent = document.createElement('span');
            taskContent.textContent = `${task.title}: ${task.description} - ${task.status}`;
            li.appendChild(taskContent);

            // Edit button
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editTask(task));
            li.appendChild(editButton);

            // Delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteTask(task._id));
            li.appendChild(deleteButton);

            taskList.appendChild(li);
        });
    }

    // Add or update task
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const taskData = {
            title: taskTitle.value,
            description: taskDescription.value,
            status: taskStatus.value
        };

        try {
            let response;
            if (editMode && currentTaskId) {
                response = await fetch(`http://localhost:3000/api/tasks/${currentTaskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(taskData)
                });
            } else {
                response = await fetch('http://localhost:3000/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(taskData)
                });
            }

            if (!response.ok) {
                throw new Error('Failed to save task');
            }

            fetchTasks();  // Refresh the task list
        } catch (error) {
            console.error('Error saving task:', error);
        }

        taskForm.reset();
        editMode = false;
        currentTaskId = null;
    });

    // Edit task
    function editTask(task) {
        taskTitle.value = task.title;
        taskDescription.value = task.description;
        taskStatus.value = task.status;
        editMode = true;
        currentTaskId = task._id;
    }

    // Delete task
    async function deleteTask(taskId) {
        try {
            await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
                method: 'DELETE'
            });
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    // Handle file upload
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('file');
    
        if (!fileInput.files.length) {
            alert('Please select a file to upload.');
            return;
        }
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        try {
            
            console.log('gautam')
            const response = await fetch('http://localhost:3000/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            const result = await response.json();
            alert(`${result.message}`)
            // Open the file in a new tab
            if (result.filePath) {
                window.open(`http://127.0.0.1:5500/${result.filePath}`, '_blank');
            }
            fetchTasks();
        } catch (error) {
            console.error('Error uploading file:', error);
        }

        uploadForm.reset();
    });


    // summery
    function renderTasks(tasks) {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.setAttribute('data-id', task._id);
    
            const taskContent = document.createElement('span');
            taskContent.textContent = `${task.title}: ${task.description} - ${task.status}`;
            li.appendChild(taskContent);
    
            // Edit button
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editTask(task));
            li.appendChild(editButton);
    
            // Delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteTask(task._id));
            li.appendChild(deleteButton);
    
            // Summary button
            const summaryButton = document.createElement('button');
            summaryButton.textContent = 'Summary';
            summaryButton.addEventListener('click', () => showTaskSummary(task));
            li.appendChild(summaryButton);
    
            taskList.appendChild(li);
        });
    }
    
    function showTaskSummary(task) {
        const { title, description, status } = task;
        const summary = `Task Summary is : Title: ${title}, Description: ${description}, Status: ${status}`;
    
        alert(summary);
    }
    

    // Initial fetch of tasks
    fetchTasks();
});
