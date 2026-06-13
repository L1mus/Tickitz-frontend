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
        return rejectWithValue(message ?? 'One or more seats are already taken');
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
    toggleSeat: (state, action) => {
      const seat = action.payload;
      const isLoveNest = seat.seatType && seat.seatType.toLowerCase().includes('love');
      if (isLoveNest) {
        const isOdd = seat.seatNumber % 2 !== 0;
        const partnerNumber = isOdd ? seat.seatNumber + 1 : seat.seatNumber - 1;

        const partnerSeat = state.seatPage.seats.find(
          (s) => s.row.toUpperCase() === seat.row.toUpperCase() && s.seatNumber === partnerNumber
        );

        const isAlreadySelected = state.selectedSeats.some((s) => s.id === seat.id);

        if (isAlreadySelected) {
          state.selectedSeats = state.selectedSeats.filter(
            (s) => s.id !== seat.id && (partnerSeat ? s.id !== partnerSeat.id : true)
          );
        } else {
          if (seat.status !== 'Sold' && (!partnerSeat || partnerSeat.status !== 'Sold')) {
            state.selectedSeats.push(seat);
            if (partnerSeat) state.selectedSeats.push(partnerSeat);
          }
        }
      } else {
        const isAlreadySelected = state.selectedSeats.some((s) => s.id === seat.id);
        if (isAlreadySelected) {
          state.selectedSeats = state.selectedSeats.filter((s) => s.id !== seat.id);
        } else {
          if (seat.status !== 'Sold') state.selectedSeats.push(seat);
        }
      }
    },
    clearSelectedSeats: (state) => {
      state.selectedSeats = [];
    },
    resetBooking: (state) => {
      state.booking = initialState.booking;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSeatPage.pending, (state) => {
        state.seatPage.loading = true;
        state.seatPage.error = null;
      })
      .addCase(getSeatPage.fulfilled, (state, action) => {
        state.seatPage.loading = false;
        state.seatPage.summary = action.payload.summary;
        state.seatPage.seats = (action.payload.seats || []).map((seat) => ({
          id: seat.seat_id,
          row: seat.row,
          seatNumber: seat.seat_number,
          seatType: seat.seat_type ? seat.seat_type.toLowerCase() : 'regular',
          status: seat.seat_status === 'sold' || seat.seat_status === 'Sold' ? 'Sold' : 'Available',
        }));
      })
      .addCase(getSeatPage.rejected, (state, action) => {
        state.seatPage.loading = false;
        state.seatPage.error = action.payload;
      });
  },
});

export const { toggleSeat, clearSelectedSeats, resetBooking } = orderSlice.actions;
export default orderSlice.reducer;