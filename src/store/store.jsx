
import { configureStore } from "@reduxjs/toolkit";

import questionsReducer from "./quesSlice";
import uidReducer from "./uidSlice";


const store  = configureStore({
    reducer:{
    questions:questionsReducer,
    uid:uidReducer
    },
})

export default store;