import cookieParser from "cookie-parser";
import express from "express"
import cors from "cors"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// app.use(express.json({limit: '16kb'}))

app.use(express.json())

app.use(express.urlencoded({extended: true,limit: '16kb'}));

app.use(express.static('public'));

app.use(cookieParser());

//routes
import userRoutes from './routes/user.routes.js'
import donationRoutes from './routes/donation.routes.js'
import mobileRoutes from './mobile.js'

app.use("/v1/user",userRoutes)
app.use("/v1/donation",donationRoutes)
app.use("/v1/mobile",mobileRoutes)

export {app}