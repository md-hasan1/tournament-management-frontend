import { combineReducers } from "@reduxjs/toolkit";
import baseApi from "../api/baseApi";
import authReducer from "@/redux/features/auth/authSlice";
import teamSelectionReducer from "@/redux/features/teamSelection/teamSelectionSclice"

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  teamSelection: teamSelectionReducer
});

export default rootReducer;
