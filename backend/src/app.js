import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin:[
        "http://localhost:5173",
        "https://raadi.vercel.app",
    ],
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

import galleryRoute from './routes/gallery.routes.js'
app.use("/api/v1/gallery",galleryRoute);

import specialProductRoute from './routes/specialProducts.routes.js'
app.use("/api/v1/featuredProduct",specialProductRoute);

import bestSeller from './routes/bestSeller.routes.js'
app.use("/api/v1/bestSeller",bestSeller);

import promoCard from './routes/promoCard.routes.js'
app.use("/api/v1/promoCard",promoCard);

import homeBanner from './routes/homeBanner.routes.js'
app.use("/api/v1/homeBanner",homeBanner);

import aboutBanner from './routes/aboutBanner.routes.js'
app.use("/api/v1/aboutBanner",aboutBanner);

import aboutIntro from './routes/aboutIntro.routes.js'
app.use("/api/v1/aboutIntro",aboutIntro);

import videoSection from './routes/videoSection.routes.js'
app.use("/api/v1/videoSection",videoSection);

import topProduct from './routes/topProduct.routes.js'
app.use("/api/v1/topProduct",topProduct);

import featuredProduct from './routes/featuredProduct.routes.js'
app.use("/api/v1/featuredProducts",featuredProduct);

import promoCode from './routes/promoCode.routes.js'
app.use("/api/v1/promoCode",promoCode);

import pricingConfig from './routes/pricingConfig.routes.js'
app.use("/api/v1/pricingConfig",pricingConfig);

export {app}