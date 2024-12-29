
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  title:"",
  headerImage:null,
  questions: [],
};

export const fetchquestions = createAsyncThunk('questions/fetchQuestions', async () => {
    try{
  const response = await fetch('http://localhost:3000/getform',{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if(!response.ok){
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
}
catch(error){
  console.error(error);
  throw error;
}
});

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    addOrUpdateQuestion: (state, action) => {
      const { index, questionData } = action.payload;
      state.questions[index] = questionData;
    },
    deleteQuestion: (state, action) => {
      const { index } = action.payload;
      state.questions.splice(index, 1);
    },
    resetQuestions: (state) => {
      state.questions = [];
      state.headerImage = null;
      state.title = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchquestions.fulfilled, (state, action) => {
        state.title = action.payload.title || "";
        state.headerImage = action.payload.headerImage || null;
        state.questions = action.payload.questions || [];
    });
  },
});

export const { addOrUpdateQuestion, deleteQuestion, resetQuestions } = questionsSlice.actions;
export default questionsSlice.reducer;
