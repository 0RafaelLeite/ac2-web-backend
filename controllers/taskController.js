const express = require('express')
const auth = require('../middlewares/authentication')
const taskController = express.Router()
const TaskModel = require('../models/task')

taskController.post("/createTask",auth , async (req,res) => {
    const {description, status, time, assignee} = req.body

    var task = {
        description: description,
        status: status,
        time: time,
        assignee: assignee
    }


    try{
        await TaskModel.create(task)
        return res.status(201).json({
            mensagem: "Task created successfully"
        })
    }
        
    catch(error) {
        return res.status(500).json({
            error : error
        })
    }
    
})

taskController.get("/unassignee-tasks/",auth , async (req,res) => {
    
    try {
        let tasks = await TaskModel.find({assignee: ""})

        return res.status(200).json(tasks)
        
    }catch(err){
        console.log(`Something went wrong ${err}`)
        return res.status(500).json({error : err})
    }
})

taskController.put("/edit/:id",auth , async (req, res) => {
    const id = req.params.id;
    const { assignee } = req.body;

    if (!assignee) {
        return res.status(400).json({ error: "Assignee is required" });
    }

    try {
        let task = await TaskModel.findById(id);

        if (!task) {
            return res.status(404).json({ mensagem: "Task not found" });
        }

        task.assignee = assignee;
        await task.save();

        return res.status(200).json(task);
    } catch (err) {
        console.log(`Something went wrong: ${err}`);
        return res.status(500).json({ error: err });
    }
});

taskController.get("/my-tasks",auth , async (req, res) => {
    const userName = req.user.name;

    try {
        let tasks = await TaskModel.find({assignee: userName})

        return res.status(200).json(tasks)
        
    }catch(err){
        console.log(`Something went wrong ${err}`)
        return res.status(500).json({error : err})
    }
});

taskController.delete("/delete-my-task/:id",auth , async (req, res) => {
    const userName = req.user.name;
    const id = req.params.id;

    try {
        let task = await TaskModel.find({assignee: userName, _id: id})
        
        if (!task) {
            return res.status(404).json({ mensagem: "Task not found" });
        }

        await TaskModel.deleteOne({ _id: id });

        return res.status(200).json({ message: "Task deleted successfully" })
        
    }catch(err){
        console.log(`Something went wrong ${err}`)
        return res.status(500).json({error : err})
    }
});

taskController.put("/edit-my-task/:id",auth , async (req, res) => {
    const userName = req.user.name;
    const id = req.params.id;
    const taskUpdates = req.body;

    try {
        let task = await TaskModel.find({assignee: userName, _id: id})

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        await TaskModel.updateOne({ _id: id }, taskUpdates);
        task = await TaskModel.find({_id: id})
        return res.status(200).json(task)
        
    }catch(err){
        console.log(`Something went wrong ${err}`)
        return res.status(500).json({error : err})
    }
});

module.exports = taskController