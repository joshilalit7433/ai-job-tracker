import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";


import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth","notifications"], 
};
const rootReducer = combineReducers({
  auth: authSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export default store;
