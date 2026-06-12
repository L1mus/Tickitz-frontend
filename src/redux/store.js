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
// import env from "../utils/environment";

const authPersistConfig = {
  key: "auth",
  storage,
  blacklist: ['registeredEmail', 'isActivationSuccess', 'isLoading', 'error', 'resetPassEmail', 'isResetOtpVerified'],
};
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  movies: movieReducer,
});

export const store = configureStore({
  reducer: rootReducer,
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