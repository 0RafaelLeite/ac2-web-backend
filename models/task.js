const mongoose = require('mongoose')

const TaskModel = mongoose.model('tasks', {
    description: String,
    time: String,
    status: String,
    assignee: String
})

module.exports = TaskModel