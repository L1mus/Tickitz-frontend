// import React from "react";
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { getProfilSlice } from './redux/slices/userSlice';
import Login from './pages/Login';
import Register from './pages/Register';
import ActivatePage from './pages/ActivatePage';
import CheckEmail from './pages/CheckEmail';
import VerifyOtp from './pages/CheckOTP';
import Reset from './pages/ForgotPassword';
import Done from './pages/Done';
import ProfilePage from './pages/ProfilePage';
// import ProfileLayout from "./components/templates/ProfileLayout";
import MainLayout from './components/templates/MainLayout';
import LandingPage from './pages/LandingPage';
import MovieList from './pages/MovieList';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import ListMovie from './pages/ListMovie';
import AddMovie from './pages/AddMovie';
import {
  RequireRegistration,
  RequireActivationSuccess,
} from './components/ProtectedRoute';
import {
  OtpProtectedRoute,
  ResetPasswordProtectedRoute,
} from './components/ProtectedRoute';
import {
  RequireAuth,
  RequireAdmin,
  PreventAdmin,
} from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import OrderPage from './pages/Order';
import Payment from './pages/Payment';
import TicketResult from './pages/TicketResult';
import MovieDetails from './pages/MovieDetails';
function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getProfilSlice());
    }
  }, [token, dispatch]);
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} autoClose={3000} />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="auth">
            <Route index element={<Login />} />
            <Route path="register">
              <Route index element={<Register />} />
              <Route element={<RequireRegistration />}>
                <Route path="activate">
                  <Route index element={<ActivatePage />} />
                  <Route element={<RequireActivationSuccess />}>
                    <Route path="done" element={<Done />} />
                  </Route>
                </Route>
              </Route>
            </Route>
            <Route path="check-email">
              <Route index element={<CheckEmail />} />
              <Route element={<OtpProtectedRoute />}>
                <Route path="verify-otp">
                  <Route index element={<VerifyOtp />} />
                  <Route element={<ResetPasswordProtectedRoute />}>
                    <Route path="reset" element={<Reset />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
        <Route element={<MainLayout />}>
          {/* public */}
          <Route element={<PreventAdmin />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="movies" element={<MovieList />} />
            <Route path="movies/:id" element={<MovieDetails />} />
          </Route>

          {/* ini rute user */}
          <Route path="users" element={<RequireAuth />}>
            <Route path="profile" element={<ProfilePage />} />
            {/* <Route path="profile" element={<ProfilePage />} /> */}
            <Route path="payment/:bookingId" element={<Payment />} />
            <Route path="order" element={<OrderPage />} />
            <Route path="result/:transactionId" element={<TicketResult />} />
          </Route>

          {/* ini rute admin nantinya */}
          <Route path="admin" element={<RequireAdmin />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="movies">
              <Route index element={<ListMovie />} />
              <Route path="add-movie" element={<AddMovie />} />
              <Route path="add-movie/:id" element={<AddMovie />} />
            </Route>
          </Route>
        </Route>
        {/* <Route path="dashboard" element={<Dashboard />} />
        <Route path='profile' element={<ProfilePage />} /> */}

      </Routes>
    </>
  );
}

export default App;
