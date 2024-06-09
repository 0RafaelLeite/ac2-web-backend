require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
const loginController = require('./authentication/login')
const taskController = require('./controllers/taskController')
const userController = require('./controllers/userController')
const server = express()
server.use(express.json())

const PORT = process.env.PORT
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const DB_URL = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.rbh5wyz.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=cluster0`

server.use("/login", loginController)
server.use("/users", userController)
server.use("/tasks", taskController)

mongoose.connect(DB_URL).then(() => {
    console.log("DB successfully connected")
        server.listen(PORT, () => {

            console.log("server running on " + PORT)
        })
})
.catch( (error) => {
    console.log("error connecting to DB: " + error)
})