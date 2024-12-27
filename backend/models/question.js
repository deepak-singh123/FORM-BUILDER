
import mongoose from "mongoose";

// Schema for a single question
const QuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true, 
  },
  prompt: {
    type: String,
    required: true,
  },
  image: {
    type: String, 
  },
  categories: [
    {
      name: String,
      items: [String],
    },
  ],
  options: [String], 
  blanks: [
    {
      index: Number, 
      answer: String,
    },
  ],
  description: {
    type: String, 
  },
  feedback: {
    type: String, 
  },
  points: {
    type: Number, 
  },
});

export const Question = mongoose.model("Question", QuestionSchema);
