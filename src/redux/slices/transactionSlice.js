import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchPaymentPage,
  postSubmitPayment,
  postConfirmPayment,
  fetchTicketResult,
  fetchQrImage,
} from '../../services/transactionService';

export const getPaymentPage = createAsyncThunk(
  'transaction/getPaymentPage',
  async (bookingId, { rejectWithValue }) => {
    try {
      const res = await fetchPaymentPage(Number(bookingId));
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? 'Failed to retrieve payment data'
      );
    }
  }
);

export const submitPayment = createAsyncThunk(
  'transaction/submitPayment',
  async ({ bookingId, paymentMethodId }, { rejectWithValue }) => {
    try {
      const res = await postSubmitPayment(bookingId, paymentMethodId);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? 'Failed to process payment'
      );
    }
  }
);

export const confirmPayment = createAsyncThunk(
  'transaction/confirmPayment',
  async ({ transactionId, bookingId }, { rejectWithValue }) => {
    try {
      const res = await postConfirmPayment(transactionId, bookingId);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? 'Payment not confirmed'
      );
    }
  }
);

export const getTicketResult = createAsyncThunk(
  'transaction/getTicketResult',
  async (transactionId, { rejectWithValue }) => {
    try {
      const res = await fetchTicketResult(transactionId);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Ticket not found');
    }
  }
);

export const getQrImage = createAsyncThunk(
  'transaction/getQrImage',
  async (transactionId, { rejectWithValue }) => {
    try {
      const res = await fetchQrImage(transactionId);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? 'Failed to load QR Code'
      );
    }
  }
);

const initialState = {
  paymentPage: {
    data: null,
    loading: false,
    error: null,
  },
  modal: {
    data: null,
    loading: false,
    error: null,
    isOpen: false,
  },
  ticketResult: {
    data: null,
    loading: false,
    error: null,
  },
  qrCode: {
    data: null,
    loading: false,
    error: null,
  },
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    openModal(state) {
      state.modal.isOpen = true;
    },
    closeModal(state) {
      state.modal.isOpen = false;
    },
    resetTransaction() {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getPaymentPage.pending, (state) => {
        state.paymentPage.loading = true;
        state.paymentPage.error = null;
      })
      .addCase(getPaymentPage.fulfilled, (state, action) => {
        state.paymentPage.loading = false;
        state.paymentPage.data = action.payload;
      })
      .addCase(getPaymentPage.rejected, (state, action) => {
        state.paymentPage.loading = false;
        state.paymentPage.error = action.payload;
      });
    builder
      .addCase(submitPayment.pending, (state) => {
        state.modal.loading = true;
        state.modal.error = null;
      })
      .addCase(submitPayment.fulfilled, (state, action) => {
        state.modal.loading = false;
        state.modal.data = action.payload;
        state.modal.isOpen = true;
      })
      .addCase(submitPayment.rejected, (state, action) => {
        state.modal.loading = false;
        state.modal.error = action.payload;
      });
    builder
      .addCase(confirmPayment.pending, (state) => {
        state.ticketResult.loading = true;
        state.ticketResult.error = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.ticketResult.loading = false;
        state.ticketResult.data = action.payload;
        state.modal.isOpen = false;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.ticketResult.loading = false;
        state.ticketResult.error = action.payload;
      });
    // getTicketResult
    builder
      .addCase(getTicketResult.pending, (state) => {
        state.ticketResult.loading = true;
        state.ticketResult.error = null;
      })
      .addCase(getTicketResult.fulfilled, (state, action) => {
        state.ticketResult.loading = false;
        state.ticketResult.data = action.payload;
      })
      .addCase(getTicketResult.rejected, (state, action) => {
        state.ticketResult.loading = false;
        state.ticketResult.error = action.payload;
      });
    //qrCode
    builder
      .addCase(getQrImage.pending, (state) => {
        state.qrCode.loading = true;
        state.qrCode.error = null;
      })
      .addCase(getQrImage.fulfilled, (state, action) => {
        state.qrCode.loading = false;
        state.qrCode.data = action.payload;
      })
      .addCase(getQrImage.rejected, (state, action) => {
        state.qrCode.loading = false;
        state.qrCode.error = action.payload;
      });
  },
});

export const { openModal, closeModal, resetTransaction } =
  transactionSlice.actions;

export const selectPaymentPage = (state) => state.transaction.paymentPage;
export const selectModal = (state) => state.transaction.modal;
export const selectTicketResult = (state) => state.transaction.ticketResult;

export default transactionSlice.reducer;
