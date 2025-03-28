
import mongoose from "mongoose";

// Schema for a single question
export const QuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    
  },
  prompt: {
    type: String,
    
  },
  image: {
    type: String, 
  },
  categories: [
    {
      id: String,
      name: String,
     
    },
  ],
  items:[
    { id: String,
      text: String,
      category: String,
    }
  ],
  options: [
    {
      id: { type: String, required: true },
      text: { type: String, required: false },
      isselected: { type: Boolean, required: true },
      type: { type: String, required: false }, 
    },
  ],
  blanks: [
    {
      index: Number, 
      answer: String,
    },
  ],
  description: {
    type: String, 
  },
  preview:{
    type: String,
  },
  sentence: {
    type: String, 
  },
  passage:{
    type: String,
  },
  subquestions: [
    {
      id: {
        type: String,
        required: true, 
      },
      question: {
        type: String,
        required: false,
      },
      options: [
        {
          id: {
            type: String,
            required: true, 
          },
          value: {
            type: String,
            required: false,
          },
          isanswer: {
            type: Boolean,
            default: false, 
          },
        }
      ],
    }
  ],
  feedback: {
    type: String, 
  },
  points: {
    type: Number, 
    default:null
  },
});

export const Question = mongoose.model("Question", QuestionSchema);
