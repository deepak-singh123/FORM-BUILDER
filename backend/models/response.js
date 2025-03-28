import mongoose from "mongoose";

const ResponseSchema = new mongoose.Schema({
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        response: mongoose.Schema.Types.Mixed, 
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  });

  export const Response = mongoose.model("Response", ResponseSchema);