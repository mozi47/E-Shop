import express from "express"
import asyncHandler from "express-async-handler"
import Order from "../models/orderModel.js"
import {Protect,Admin} from "../middleware/authmiddleware.js"
const router = express.Router()

//add Order Items
router.post("/", Protect, asyncHandler(async(req,res)=>{
    const {
        orderItems, 
        shippingAddress, 
        paymentMethod, 
        itemsPrice,
        taxPrice, 
        shippingPrice, 
        totalPrice
    } = req.body
    
    if(orderItems && orderItems.length ===0){
        res.status(400)
        throw new Error("No order items")
        return
    }else{
        const order = new Order({
            user: req.user._id,
            orderItems, 
            shippingAddress, 
            paymentMethod, 
            itemsPrice,
            taxPrice, 
            shippingPrice, 
            totalPrice
        })
        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
    }
}))

//Update the Order to Paid
router.put("/:id/paid", Protect, asyncHandler(async(req,res)=>{
    const order = await Order.findById(req.params.id)
    
    if(order){
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }
        const updateOrder = await order.save()
        res.json(updateOrder)
    }else{
        res.status(404)
        throw Error("Order not found")
    }
    
}))

//Update the Order to Delivered
router.put("/:id/delivered", [Protect,Admin], asyncHandler(async(req,res)=>{
    const order = await Order.findById(req.params.id)
    
    if(order){
        order.isDelivered = true
        order.deliveredAt = Date.now()
        const updateOrder = await order.save()
        res.json(updateOrder)
    }else{
        res.status(404)
        throw Error("Order not found")
    }
    
}))

//Get the logged in User orders to profile
router.get("/myorders", Protect, asyncHandler(async(req,res)=>{
    const orders = await Order.find({user: req.user._id})
    res.json(orders)   
    
}))


//Get Order By ID
router.get("/:id", Protect, asyncHandler(async(req,res)=>{
    const order = await Order.findById(req.params.id).populate("user","name email")
    if(order){
        res.json(order)
    }else{
        res.status(404)
        throw Error("Order not found")
    }
    
}))

//Get all Order By ADMIN
router.get("/", [Protect,Admin], asyncHandler(async(req,res)=>{
    const order = await Order.find({}).populate("user","name email")
    res.json(order)
}))

export default router


