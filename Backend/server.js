import express from "express"
import dotenv from "dotenv"
import path from "path"
import colors from "colors"
import {notFound, errorHandler} from "./middleware/errormiddleware.js"
import connectDB from "./config/db.js"
import productRoutes from "./routes/productRoute.js"
import userRoute from "./routes/userRoute.js"
import orderRoute from "./routes/orderRoute.js"
import uploadRoute from "./routes/uploadRoute.js"
import morgan from "morgan"

dotenv.config()
connectDB()
const app= express()
if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"))
}
app.use(express.json())

app.use("/api/products",productRoutes)
app.use("/api/users",userRoute)
app.use("/api/orders",orderRoute)
app.use("/api/uploads",uploadRoute)
app.get("/api/config/paypal",(req,res)=>res.send(process.env.PAYPAL_CLIENT_ID))
//static folder access
const __dirname = path.resolve()
app.use("/uploads",express.static(path.join(__dirname,"/uploads")))

if(process.env.NODE_ENV ==="production"){
    app.use(express.static(path.join(__dirname,"/frontend/build")))
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
    })
}

//middleware
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`SERVER IS RUNNING IN ${process.env.NODE_ENV} MODE ON ${PORT}`.yellow.bold))