import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { activateAPI, loginAPI, registerAPI, forgotPasswordAPI, verifyResetOtpAPI,resetPasswordAPI, logoutAPI } from "../../services/authServices";

export const registerSlice = createAsyncThunk(
  "auth/register", async (payload, { rejectWithValue }) => {
    try {
      const data = await registerAPI(payload)
      return data;
    } catch (error) {
      // console.dir(error);
      // const backendMessage =
      //   error.response?.data?.error ||
      //   error.response?.data?.message ||
      //   error.response?.data?.Error ||
      //   error.message; 
      return rejectWithValue(error.response?.data?.message || "Registration failed")
      // return rejectWithValue(backendMessage || "Registration failed")
    }
  }
)
export const loginSlice = createAsyncThunk(
  "auth/login", async (payload, { rejectWithValue }) => {
    try {
      const data = await loginAPI(payload)
      return data;
    } catch (error) {
      // const backendMessage =
      //   error.response?.data?.error ||
      //   error.response?.data?.message ||
      //   error.response?.data?.Error ||
      //   error.message;
      return rejectWithValue(error.response?.data?.message || "Login failed, Try again!")
    }
  }
)
export const activateSlice = createAsyncThunk(
  "auth/activate", async (payload, { rejectWithValue }) => {
    try {
      const data = await activateAPI(payload)
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Activation OTP failed")
    }
  }
)
export const forgotPasswordSlice = createAsyncThunk(
  "auth/forgotPassword", async(payload,{rejectWithValue})=>{
    try {
      const data=await forgotPasswordAPI(payload)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to")
    }
  }
)

export const verifyResetOtpSlice = createAsyncThunk(
  "auth/verifyResetOtp", async(payload,{rejectWithValue}) =>{
    try {
      const data=await verifyResetOtpAPI(payload)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Invalid or Expired OTP")
      
    }
  }
)
export const resetPasswordSlice = createAsyncThunk(
  "auth/resetPassword", async (payload, { rejectWithValue }) => {
    try {
      const data = await resetPasswordAPI(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to reset password");
    }
  }
);
export const logoutSlice = createAsyncThunk(
    "auth/logout", async (_, { getState, dispatch, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            
            const data = await logoutAPI(token);
            dispatch(clearAuthForce()); 
            return data;
        } catch (error) {
            dispatch(clearAuthForce());
            return rejectWithValue(error.response?.data?.message || "Logout failed");
        }
    }
);

const initialState = {
  token: null,
  isAuthenticated: false,
  currentUser: null,
  registeredEmail: null,
  role:null,
  isActivationSuccess: false,
  isLoading: false,
  error: null,
  resetPassEmail: null,
  isResetOtpVerified:false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthForce: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.currentUser = null;
      state.error = null;
      state.registeredEmail = null;
      state.role=null;
      state.isActivationSuccess = false;
      state.resetPassEmail=null;
      state.isResetOtpVerified=false;
    },
    setRegisteredEmail: (state, action) => {
      state.registeredEmail = action.payload;
    },
    resetActivation: (state) => {
      state.isActivationSuccess = false;
      state.registeredEmail = null;
    },
    setResetPassEmail: (state, action) => {
      state.resetPassEmail = action.payload;
    },
    clearResetFlow: (state) => {
      state.resetPassEmail = null;
      state.isResetOtpVerified = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // for register
      .addCase(registerSlice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerSlice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registeredEmail = action.meta.arg.email;
        // state.registeredEmail = action.payload.email;
      })
      .addCase(registerSlice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // for login
      .addCase(loginSlice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginSlice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.data.token;
        state.role = action.payload.data.user.role;
        state.currentUser = action.payload.data.user;
      })
      .addCase(loginSlice.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      // for activate otp
      .addCase(activateSlice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(activateSlice.fulfilled, (state) => {
        state.isLoading = false;
        state.isActivationSuccess = true;
      })
      .addCase(activateSlice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // forgotpass
      .addCase(forgotPasswordSlice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordSlice.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPasswordSlice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // verifyotp reset pass
      .addCase(verifyResetOtpSlice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyResetOtpSlice.fulfilled, (state) => {
        state.isLoading = false;
        state.isResetOtpVerified = true;
      })
      .addCase(verifyResetOtpSlice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // reset pass
      .addCase(resetPasswordSlice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordSlice.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPasswordSlice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
  }
});

export const { clearAuthForce, setRegisteredEmail, resetActivation,setResetPassEmail, clearResetFlow } = authSlice.actions
export default authSlice.reducer;
