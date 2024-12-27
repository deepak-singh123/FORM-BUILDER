import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cloudinary from "cloudinary";


dotenv.config();

const app = express();


cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true,
});


mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Database connected"))
.catch((e) => console.log("Database connection error:", e));







app.listen(process.env.PORT, () => {
    console.log(`Server is active on port ${process.env.PORT}`);
});