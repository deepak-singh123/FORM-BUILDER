import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import upload from "./middleware/multer.js";
import fs from "fs";
import { Form } from "./models/form.js";
import { Response } from "./models/response.js";

dotenv.config();

const app = express();
app.use(cors({origin:["https://quizform.netlify.app"],credentials:true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true,
});


app.post("/image-upload", upload.single("file"), async (req, res) => {
  
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
  
    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        asset_folder: 'Form Builder',
        resource_type: "image",
      });
  
      // Remove the uploaded file from the server
  
      res.status(200).json({
        message: "Image uploaded successfully",
        url: result.secure_url,
      });

      fs.unlinkSync(req.file.path);

    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      res.status(500).json({ message: "Image upload failed", error: error.message });
    }
  });

  app.post("/save-form/:id", async (req, res) => {
    console.log("req params=",req.params);
    const data = req.body;
    const {id}=req.params;

    console.log("id=",id);
    const clientIp =req.headers["x-forwarded-for"] || req.connection.remoteAddress;

      let uid = `${clientIp}-default-form`;
      if (typeof id === 'string' ){
        uid=id;
      }
      
      console.log("uid=",uid);
    if (!data) {
      return res.status(400).json({ message: "No data provided" });
    }
  
    try {
      // Check if a form with the UID exists
      console.log("uid= in save form",uid);
      const form = await Form.findOne({ uid: uid });
  
      if (!form) {
        await Form.create({
          title: data.title,
          headerImage: data.headerImage,
          questions: data.questions,
          uid: uid,
        });
      } else {
        await form.updateOne({
          title: data.title,
          headerImage: data.headerImage,
          questions: data.questions,
        });
      }
  
      return res.status(200).json({ message: "Form saved successfully" });
    } catch (error) {
      console.error("Error saving form:", error);
      return res.status(500).json({ message: "An error occurred while saving the form" });
    }
  });
  
app.get("/getform/:id", async (req, res) => {
    console.log("inside get form");
    const {id}=req.params;
    const clientIp =
        req.headers["x-forwarded-for"] || // For users behind a proxy
        req.connection.remoteAddress; // For local development
        console.log(clientIp);

        let uid = `${clientIp}-default-form`;
        if (typeof id === 'string' ){
          uid=id;
        }
        console.log("uid=",uid);
    try {
      const form = await Form.findOne({ uid: uid });
  
      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }
      
      return res.status(200).json(form);
    } catch (error) {
      console.error("Error fetching form:", error);
      return res.status(500).json({ message: "An error occurred while fetching the form" });
    }
  });

  app.post("/submit-form/:uid", async (req, res) => {
    const { uid } = req.params;
    const data = req.body;
  
    try {
      const form = await Form.findOne({ uid: uid });
      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }
  
      let response = await Response.findOne({ formId: form._id });
  
      if (!response) {
        response = await Response.create({
          formId: form._id,
          answers: data.answers,
          submittedAt: Date.now(),
        });
      } else {
        await response.updateOne({
          answers: data.answers,
          submittedAt: Date.now(),
        });
      }
  
      // Avoid returning MongoDB objects directly; sanitize them or use `.toObject()`.
      return res
        .status(200)
        .json({ message: "Form submitted successfully", response: response.toObject() });
    } catch (error) {
      console.error("Error submitting form:", error);
      return res.status(500).json({ message: "An error occurred while submitting the form" });
    }
  });
  



mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Database connected"))
.catch((e) => console.log("Database connection error:", e));







app.listen(process.env.PORT, () => {
    console.log(`Server is active on port ${process.env.PORT}`);
});