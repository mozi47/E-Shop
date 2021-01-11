import express from "express"
import Product from "../models/productModel.js"
const router = express.Router()
import asyncHandler from "express-async-handler"
import {Protect, Admin} from "../middleware/authmiddleware.js"

//Get Top Rated Products
router.get("/top", asyncHandler(async (req,res)=>{
    
    const products = await Product.find({}).sort({ rating:-1 }).limit(3)
    res.json(products)
 
 }))

//Fetch all products
router.get("/",asyncHandler(async (req,res)=>{
    const pageSize = 10
    const page = Number(req.query.pageNumber || 1)
    const keyword = req.query.keyword ? {
        name:{
            $regex: req.query.keyword,
            $options: "i"
        }
    }:{}

    const count = await Product.countDocuments({...keyword})
    const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1))
    res.json({products, page, pages:Math.ceil(count/pageSize)})
}))

//fetch single product
router.get("/:id",asyncHandler(async (req,res)=>{
    const product = await Product.findById(req.params.id)
    if(product){
        res.json(product)
    }else{
        res.status(404)
        throw new Error("Product not Found")
    }
    
}))

//Create product by admin
router.post("/",[Protect, Admin],asyncHandler(async (req,res)=>{
    const product = new Product({
        name:"sample name",
        price: 0,
        user: req.user._id,
        image: "/images/sample.jpg",
        brand: "Sample brand",
        category: "Sample category",
        countInStock: 0,
        numReviews: 0,
        description: "Sample description"
    })

   const createProduct = await product.save() 
   res.status(201).json(createProduct)
    
}))

//Update product by admin
router.put("/:id",[Protect, Admin],asyncHandler(async (req,res)=>{
    const{name, price, description,image,brand,category,countInStock} = req.body

    const product = await Product.findById(req.params.id)

    if(product){
        product.name= name,
        product.price= price,
        product.description=  description,
        product.image = image,
        product.brand= brand,
        product.category= category,
        product.countInStock= countInStock
                
        const UpdateProduct = await product.save() 
        res.json(UpdateProduct)
    }else{
        res.status(404)
        throw new Error("Product not Found")
    }

}))

//User Review
router.post("/:id/review",Protect,asyncHandler(async (req,res)=>{
    const{rating, comment} = req.body

    const product = await Product.findById(req.params.id)

    if(product){
        const existreview = product.reviews.find(r=>r.user.toString() === req.user._id.toString())
        if(existreview){
            res.status(404)
            throw new Error("Product already Reviewed")     
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user:req.user._id
        }       

        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce((acc,item) => item.rating+acc,0) / product.reviews.length 
        await product.save()
        res.status(201).json({message: "review added"})
    }else{
        res.status(404)
        throw new Error("Product not Found")
    }

}))

//delete product by admin
router.delete("/:id",[Protect, Admin],asyncHandler(async (req,res)=>{
    const product = await Product.findById(req.params.id)
    if(product){
        await product.remove()
        res.json({message:"Product Removed"})
    }else{
        res.status(404)
        throw new Error("Product not Found")
    }
    
}))


export default router