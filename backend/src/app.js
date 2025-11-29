import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit:"16kb"}))
app.use(cookieParser())

import userRoute from './routes/user.routes.js'
app.use("/api/v1/users",userRoute);

import productRoute from './routes/product.routes.js'
app.use("/api/v1/products",productRoute);

import categoryRoute from './routes/category.routes.js'
app.use("/api/v1/category",categoryRoute);

import cartRoute from './routes/cart.routes.js'
app.use("/api/v1/cart",cartRoute);

import wishlistRoute from './routes/wishlist.routes.js'
app.use("/api/v1/wishlist",wishlistRoute);

import orderRoute from './routes/order.routes.js'
app.use("/api/v1/order",orderRoute);

import reviewRoute from './routes/review.routes.js'
app.use("/api/v1/review",reviewRoute);

export {app}