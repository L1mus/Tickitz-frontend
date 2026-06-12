import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/es/storage";
import authReducer from "./slices/authSlice.js"
import movieReducer from "./slices/movieSlice.js"
import adminMoviesReducer from "./slices/adminMoviesSlice.js";
// import env from "../utils/environment";

const persistConfig = {
  key: "auth",
  storage,
  blacklist: ['adminMovies','registeredEmail', 'isActivationSuccess', 'isLoading', 'error'],
};
const rootReducer = combineReducers({
  auth: authReducer,
  movies: movieReducer,
  adminMovies: adminMoviesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // devTools: env.environment === "development",
  middleware: (defaultMiddleware) => {
    return defaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE],
      },
    });
  },
});

export const persistor = persistStore(store);
// export default store;