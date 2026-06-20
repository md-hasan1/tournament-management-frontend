// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

import rootReducer from "./features/rootReducer";
import baseApi from "./api/baseApi";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "teamSelection",],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

// ✅ Correct types (works with persisted reducer)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
