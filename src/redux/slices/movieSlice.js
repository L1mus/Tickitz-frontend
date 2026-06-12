import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { booksAPI, detailAPI, homeAPI } from "../../services/movieServices";

export const getMovie = createAsyncThunk(
    "/movies", async (params = {}, { rejectWithValue }) => {
        try {
            const response = await homeAPI(params);
            const responseData = response.data; 
            return {
                data: responseData?.data || [], 
                meta: responseData?.meta || responseData?.pagination || {}, 
                status: params?.status || "all", 
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Get Movies Failed");
        }
    }
);

export const getMovieDetail = createAsyncThunk(
    `/movies/getDetail`, async (id, { rejectWithValue }) => {
        try {
            const data = await detailAPI(id);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Get Movies Detail Failed");
        }
    }
);

export const getMovieShowtime = createAsyncThunk(
    `/movies/getShowTime`, async (id, {rejectWithValue}) => {
        try {
            const data = await booksAPI(id);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Get Movies Showtime Failed");
        }
    }
);

const initialState = {
  movieList: [],
  nowShowingMovies: [], 
  upcomingMovies: [],   
  movieDetail: null,
  movieShowtime : null,   
  pagination: {    
    current_page: 1,
    limit: 12,
    total_data: 0,
    total_page: 1,
    has_next: false,
    has_prev: false,
    next: null,
    prev: null,
  },
  nowShowingPagination: {    
    current_page: 1,
    limit: 12,
    total_data: 0,
    total_page: 1,
    has_next: false,
    has_prev: false,
    next: null,
    prev: null,
  },
  upComingPagination: {    
    current_page: 1,
    limit: 12,
    total_data: 0,
    total_page: 1,
    has_next: false,
    has_prev: false,
    next: null,
    prev: null,
  },
  loading: false,
  showTimeLoading: false,
  error: null,
};

const movieSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getMovie.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getMovie.fulfilled, (state, action) => {
            state.loading = false;
            const { data, meta, status } = action.payload;

            // Meta sekarang sudah aman terisi dan tidak undefined lagi
            if (status === "now_showing") {
                state.nowShowingMovies = data || [];
                state.nowShowingPagination = meta || {};
            } else if (status === "upcoming") {
                state.upcomingMovies = data || [];
                state.upComingPagination = meta || {};
            }
            
            state.movieList = data || [];
            state.pagination = meta || {};
        })
        .addCase(getMovie.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(getMovieDetail.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getMovieDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.movieDetail = action.payload.data || null;
        })
        .addCase(getMovieDetail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(getMovieShowtime.pending, (state) => {
            state.showTimeLoading = true;
            state.error = null;
        })
        .addCase(getMovieShowtime.fulfilled, (state, action) => {
            state.showTimeLoading = false;
            state.movieShowtime = action.payload.data || null;
        })
        .addCase(getMovieShowtime.rejected, (state, action) => {
            state.showTimeLoading = false;
            state.error = action.payload;
        })
    }
});

export default movieSlice.reducer;