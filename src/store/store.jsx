
import { configureStore } from "@reduxjs/toolkit";

import questionsReducer from "./quesSlice";



const store  = configureStore({
    reducer:{
    questions:questionsReducer
    },
})

export default store;