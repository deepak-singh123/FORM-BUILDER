import mongoose from "mongoose";


const FormSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    headerImage: {
      type: String, 
    },
    questions: [QuestionSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  export const Form = mongoose.model("Form", FormSchema);