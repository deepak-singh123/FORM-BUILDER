import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";









const uidSlice = createSlice({
    name:"uid",
    initialState:{uid:uuidv4()},
    reducers:{        
        setuid:(state,action)=>{
            state.uid=action.payload;
        }
    }
});

export const {setuid}=uidSlice.actions;
export default uidSlice.reducer;