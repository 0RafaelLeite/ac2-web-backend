const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserModel = require('../models/user')

const loginController = express.Router()

loginController.post("/", async (req, res) => {
    const { email, password } = req.body

    var user = await UserModel.findOne({email: email})
    if(!user){
        return res.status(400).json({message: "user not found"})
    }
    if(await bcrypt.compare(password, user.password)){
        const token = jwt.sign({name: user.name, email: user.email},
            process.env.JWT_SECRET, {expiresIn: '2d'}
        )
        return res.status(200).json({message: "user successfully logged in", token: token})
    }else{
        return res.status(401).json({
            message: "invalid email or password"
        })
    }
})

module.exports = loginController