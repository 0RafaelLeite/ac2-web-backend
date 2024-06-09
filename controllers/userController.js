const express = require('express')
const auth = require('../middlewares/authentication')
const userController = express.Router()
const UserModel = require('../models/user')
const bcryptjs = require('bcryptjs')

const RoleIds = Object.freeze({
    FRONTEND_ENGINEER: 1,
    BACKEND_ENGINEER: 2,
    DATA_ANALYST: 3,
    TECH_LEAD: 4
});

const RoleTexts = Object.freeze({
    [RoleIds.FRONTEND_ENGINEER]: 'FE engineer',
    [RoleIds.BACKEND_ENGINEER]: 'BE engineer',
    [RoleIds.DATA_ANALYST]: 'Data analyst',
    [RoleIds.TECH_LEAD]: 'Tech lead'
});

userController.get("/",auth , async (req,res) => {
    try {
        let users = await UserModel.find()
        return res.status(200).json(users)
    }catch(err){
        console.log(`Something went wrong: ${err}`)
        return res.status(500).json({error : err})
    }
})

userController.get("/email/:email",auth , async (req,res) => {
    var email = req.params.email    
    
    try {
        let user = await UserModel.findOne({email: email})
        if(!user){
            return res.status(404).json({mensagem: "User not found"})
        }
        return res.status(200).json(user)
        
    }catch(err){
        console.log(`Something went wrong ${err}`)
        return res.status(500).json({error : err})
    }
})

userController.post("/create", async (req,res) => {
    const {name, email, password, role} = req.body
     
    if (!Object.values(RoleIds).includes(role)) {
        return res.status(400).json({ error: "Invalid role provided" });
    }

    const passwordEncrypt = await bcryptjs.hash(password, 10)

    var user = {
        name: name,
        email: email,
        role: RoleTexts[role],
        password: passwordEncrypt
    }

    try{
        await UserModel.create(user)
        return res.status(201).json({
            mensagem: "User successfully created"
        })
    }
        
    catch(error) {
        return res.status(500).json({
            error : error
        })
    }
    
})

userController.put("edit/:id",auth , async (req,res) => {
    const id = req.params.id;
    const userUpdates = req.body;

    try {
        let user = await UserModel.findOne({ _id: id });
        
        if (!user) {
            return res.status(404).json({ mensagem: "User not found" });
        }
        await UserModel.updateOne({ _id: id }, userUpdates);

        user = await UserModel.findOne({ _id: id });

        return res.status(200).json(user);
    } catch (err) {
        console.log(`something went wrong: ${err}`);
        return res.status(500).json({ error: err });
    }
})

userController.delete("delete/:id",auth , async (req, res) => {
        const id = req.params.id;  
    
        try {
            const user = await UserModel.findOne({ _id: id });
    
            if (!user) {
                return res.status(404).json({ mensagem: "User not found" });
            }
    
            await UserModel.deleteOne({ _id: id });
    
            return res.status(200).json({ mensagem: "User deleted successfully" });
        } catch (err) {
            console.log(`Something went wrong during the delete: ${err}`);
            return res.status(500).json({ error: err });
        }
});
    
userController.get("/role",auth , async (req,res) => {
    
    try {
        let frontEngineer = await UserModel.find({role: 'FE engineer'})
        let backEngineer = await UserModel.find({role: 'BE engineer'})
        let dataAnalyst = await UserModel.find({role: 'Data analyst'})
        let techLead = await UserModel.find({role: 'Tech lead'})

        return res.status(200).json({"FE engineer" : frontEngineer.length, "BE engineer" : backEngineer.length, "data analyst" : dataAnalyst.length,"techLead" : techLead.length,})
        
    }catch(err){
        console.log(`Something went wrong: ${err}`)
        return res.status(500).json({error : err})
    }
})

module.exports = userController