import mongoose from "mongoose";
import { QuestionSchema } from "./question.js";


const FormSchema = new mongoose.Schema({
    title: {
      type: String,
    },
    headerImage: {
      type: String, 
    },
    questions: [QuestionSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    uid:{
      type: String
      
    }
   
  });

  export const Form = mongoose.model("Form", FormSchema);