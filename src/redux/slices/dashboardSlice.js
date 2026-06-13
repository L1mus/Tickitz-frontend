import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getSalesChartAPI,
  getTicketSalesAPI,
  getMovieOptionsAPI,
  getMovieListAPI,
} from '../../services/dashboardService';


export const fetchSalesChartThunk = createAsyncThunk(
  'dashboard/fetchSalesChart',
  async ({ filterBy, movieName = '' }, { rejectWithValue }) => {
    try {
      const response = await getSalesChartAPI({ filterBy, movieName });
      return response.data ?? [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal memuat sales chart');
    }
  }
);

export const fetchTicketSalesThunk = createAsyncThunk(
  'dashboard/fetchTicketSales',
  async ({ genreId = 0, locationId = 0 }, { rejectWithValue }) => {
    try {
      const response = await getTicketSalesAPI({ genreId, locationId });
      return response.data ?? [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal memuat ticket sales');
    }
  }
);

export const fetchMovieOptionsThunk = createAsyncThunk(
  'dashboard/fetchMovieOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMovieOptionsAPI();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal memuat options');
    }
  }
);

export const fetchMovieListThunk = createAsyncThunk(
  'dashboard/fetchMovieList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMovieListAPI();
      // response.data shape: { movies: [...], total_data, total_page, page, limit }
      const data = response.data ?? response;
      return data.movies ?? [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal memuat daftar film');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  salesChart: {
    labels: [],
    values: [],
    isLoading: false,
    error: null,
  },
  ticketSales: {
    labels: [],
    values: [],
    isLoading: false,
    error: null,
  },
  movieList: [],
  genres: [],
  locations: [],
  optionsLoading: false,
  optionsError: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ── fetchSalesChartThunk ──
    builder
      .addCase(fetchSalesChartThunk.pending, (state) => {
        state.salesChart.isLoading = true;
        state.salesChart.error = null;
      })
      .addCase(fetchSalesChartThunk.fulfilled, (state, action) => {
        state.salesChart.isLoading = false;
        const data = action.payload;
        state.salesChart.labels = data.map((d) => d.label);
        state.salesChart.values = data.map((d) => d.total_revenue);
      })
      .addCase(fetchSalesChartThunk.rejected, (state, action) => {
        state.salesChart.isLoading = false;
        state.salesChart.error = action.payload;
      });

    // ── fetchTicketSalesThunk ──
    builder
      .addCase(fetchTicketSalesThunk.pending, (state) => {
        state.ticketSales.isLoading = true;
        state.ticketSales.error = null;
      })
      .addCase(fetchTicketSalesThunk.fulfilled, (state, action) => {
        state.ticketSales.isLoading = false;
        const data = action.payload;
        state.ticketSales.labels = data.map((d) => d.movie_title);
        state.ticketSales.values = data.map((d) => d.total_sold);
      })
      .addCase(fetchTicketSalesThunk.rejected, (state, action) => {
        state.ticketSales.isLoading = false;
        state.ticketSales.error = action.payload;
      });

    // ── fetchMovieOptionsThunk ──
    builder
      .addCase(fetchMovieOptionsThunk.pending, (state) => {
        state.optionsLoading = true;
        state.optionsError = null;
      })
      .addCase(fetchMovieOptionsThunk.fulfilled, (state, action) => {
        state.optionsLoading = false;
        state.genres = action.payload.genres ?? [];
        state.locations = action.payload.locations ?? [];
      })
      .addCase(fetchMovieOptionsThunk.rejected, (state, action) => {
        state.optionsLoading = false;
        state.optionsError = action.payload;
      });

    // ── fetchMovieListThunk ──
    builder
      .addCase(fetchMovieListThunk.pending, (state) => {
        state.optionsLoading = true;
        state.optionsError = null;
      })
      .addCase(fetchMovieListThunk.fulfilled, (state, action) => {
        state.optionsLoading = false;
        state.movieList = action.payload;
      })
      .addCase(fetchMovieListThunk.rejected, (state, action) => {
        state.optionsLoading = false;
        state.optionsError = action.payload;
      });
  },
});

export default dashboardSlice.reducer;