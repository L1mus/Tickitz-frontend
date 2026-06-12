import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMoviesThunk = createAsyncThunk(
  'movies/fetchMovies',
  async (params, { rejectWithValue }) => {
    try {
      // params berisi { page, limit, month, year } dari UI
      const response = await axios.get('http://localhost:8080/api/admin/movies', { params });
      
      // Pastikan backend mengembalikan list data film beserta metadata pagination-nya
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const initialState = {
  moviesList: [],
  isLoading: false,
  error: null,
  totalPages: 1,
};

const moviesSlice = createSlice({
  name: "adminMovies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoviesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMoviesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        // Backend Anda mengembalikan object. Kita cek apakah dibungkus di .data atau langsung di payload.
        const responseData = action.payload?.data || action.payload;

        // Jika responseData memiliki properti 'movies' yang berisi array
        if (responseData && Array.isArray(responseData.movies)) {
          state.moviesList = responseData.movies; // <--- Tarik array filmnya di sini!
          state.totalPages = responseData.total_pages || responseData.totalPages || responseData.total_page || 1
        } 
        // Antisipasi jika suatu saat backend langsung mengirim array biasa
        else if (Array.isArray(responseData)) {
          state.moviesList = responseData;
          state.totalPages = 1;
        } 
        // Jika tidak ada data yang cocok, kembalikan ke array kosong agar tidak crash
        else {
          state.moviesList = [];
          state.totalPages = 1;
        }
      })
      .addCase(fetchMoviesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export default moviesSlice.reducer;