import express from "express"
import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import generateToken from "../utils/generateToken.js"
import {Protect, Admin} from "../middleware/authmiddleware.js"
const router = express.Router()


//login with authentication token
router.post("/login",asyncHandler(async(req,res)=>{
    const {email, password} = req.body
    
    const user =await User.findOne({email})
    if(user && (await user.isMatchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }else{
        res.status(401)
        throw new Error("Invalid email or password")
    }
}))

//get profiles
router.get("/profile", Protect, asyncHandler( async (req,res)=>{
    const user = await User.findById(req.user._id).select("-password")
    if(user){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    }else{
        res.status(404)
        throw new Error("User not found")
    }
}))

//register new user
router.post("/", asyncHandler(async(req,res)=>{
    const {name, email, password} = req.body
    const userExists = await User.findOne({email})

    if(userExists){
        res.status(401)
        throw new Error("User already exists")
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    }else{
        res.status(400)
        throw new Error("invalid user data")
    }

}))

//Update user profiles
router.put("/profile", Protect, asyncHandler( async (req,res)=>{
    const user = await User.findById(req.user._id)
    if(user){
        user.name= req.body.name || user.name
        user.email= req.body.email || user.email
        if(req.body.password){
            user.password= req.body.password || user.password
        }

        const updateUser = await user.save()
        res.json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin,
            token: generateToken(updateUser._id)
        })
    }else{
        res.status(404)
        throw new Error("User not found")
    }
}))

//get all users by admin
router.get("/", [Protect, Admin], asyncHandler( async (req,res)=>{
    const users = await User.find({})
    res.json(users)
}))

//delete users by admin
router.delete("/:id", [Protect, Admin], asyncHandler( async (req,res)=>{
    const user = await User.findById(req.params.id)
    if(user){
        await user.remove()
        res.json({message:"user removed"})
    }else{
        res.status(404)
        throw new Error("user not found")
    }
}))

//get user by ID by admin
router.get("/:id", [Protect, Admin], asyncHandler( async (req,res)=>{
    const user = await User.findById(req.params.id).select("-password")
    if(user){
        res.json(user)
    }else{
        res.status(404)
        throw new Error("user not found")
    }
    
}))

//Edit User by Admin
router.put("/:id", [Protect,Admin], asyncHandler( async (req,res)=>{
    const user = await User.findById(req.params.id)
    if(user){
        user.name= req.body.name || user.name
        user.email= req.body.email || user.email
        user.isAdmin = req.body.isAdmin

        const updateUser = await user.save()
        res.json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin
        })
    }else{
        res.status(404)
        throw new Error("User not found")
    }
}))

export default router