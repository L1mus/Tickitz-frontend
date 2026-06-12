import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSeatPage, postCreateBooking } from '../../services/orderService';

export const getSeatPage = createAsyncThunk(
  'order/getSeatPage',
  async (showtimeId, { rejectWithValue }) => {
    try {
      const res = await fetchSeatPage(showtimeId);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? 'Failed to retrieve seat data'
      );
    }
  }
);

export const createBooking = createAsyncThunk(
  'order/createBooking',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await postCreateBooking(payload);
      return res.data.data;
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;
      if (status === 406) {
        return rejectWithValue(
          message ?? 'One or more seats are already taken'
        );
      }
      return rejectWithValue(message ?? 'Failed to make a booking');
    }
  }
);

const initialState = {
  seatPage: {
    summary: null,
    seats: [],
    loading: false,
    error: null,
  },
  selectedSeats: [],
  booking: {
    bookingId: null,
    loading: false,
    error: null,
  },
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    toggleSeat(state, action) {
      const seat = action.payload;
      const idx = state.selectedSeats.findIndex(
        (s) => s.seat_id === seat.seat_id
      );
      if (idx === -1) {
        state.selectedSeats.push(seat);
      } else {
        state.selectedSeats.splice(idx, 1);
      }
    },
    toggleLoveNestPair(state, action) {
      const { seats, action: act } = action.payload;
      if (act === 'deselect') {
        const ids = seats.map((s) => s.seat_id);
        state.selectedSeats = state.selectedSeats.filter(
          (s) => !ids.includes(s.seat_id)
        );
      } else {
        seats.forEach((seat) => {
          const exists = state.selectedSeats.some(
            (s) => s.seat_id === seat.seat_id
          );
          if (!exists) state.selectedSeats.push(seat);
        });
      }
    },
    clearSelectedSeats(state) {
      state.selectedSeats = [];
    },
    resetBooking(state) {
      state.booking = initialState.booking;
    },
    resetSeatPage(state) {
      state.seatPage = initialState.seatPage;
    },
  },
  extraReducers: (builder) => {
    // getSeatPage
    builder
      .addCase(getSeatPage.pending, (state) => {
        state.seatPage.loading = true;
        state.seatPage.error = null;
      })
      .addCase(getSeatPage.fulfilled, (state, action) => {
        state.seatPage.loading = false;
        state.seatPage.summary = action.payload.summary;
        state.seatPage.seats = action.payload.seats;
      })
      .addCase(getSeatPage.rejected, (state, action) => {
        state.seatPage.loading = false;
        state.seatPage.error = action.payload;
      });
    // createBooking
    builder
      .addCase(createBooking.pending, (state) => {
        state.booking.loading = true;
        state.booking.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.booking.loading = false;
        state.booking.bookingId = action.payload.booking_id;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.booking.loading = false;
        state.booking.error = action.payload;
      });
  },
});

export const {
  toggleSeat,
  toggleLoveNestPair,
  clearSelectedSeats,
  resetBooking,
  resetSeatPage,
} = orderSlice.actions;

export const selectSeatPage = (state) => state.order.seatPage;
export const selectSelectedSeats = (state) => state.order.selectedSeats;
export const selectBooking = (state) => state.order.booking;

export default orderSlice.reducer;
