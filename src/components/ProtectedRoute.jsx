import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useEffect } from "react";

export const RequireRegistration = () => {
    const { registeredEmail } = useSelector((state) => state.auth);

    if (!registeredEmail) {
        return <Navigate to="/auth/register" replace />;
    }

    return <Outlet />;
};

export const RequireActivationSuccess = () => {
    const { isActivationSuccess } = useSelector((state) => state.auth);

    if (!isActivationSuccess) {
        return <Navigate to="/auth/register/activate" replace />;
    }

    return <Outlet />;
};

export const OtpProtectedRoute = () => {
    const { resetPassEmail } = useSelector((state) => state.auth);

    if (!resetPassEmail) {
        return <Navigate to="/auth/check-email" replace />;
    }

    return <Outlet />;
};

export const ResetPasswordProtectedRoute = () => {
    const { resetPassEmail, isResetOtpVerified } = useSelector((state) => state.auth);

    if (!resetPassEmail || !isResetOtpVerified) {
        return <Navigate to="/auth/check-email" replace />;
    }
    return <Outlet />;
};

export const RequireAuth = () => {
    const { isAuthenticated, role } = useSelector((state) => state.auth);

    if (!isAuthenticated) return <Navigate to="/auth" replace />;
    
    if (role?.toLowerCase() === "admin") return <Navigate to="/admin/dashboard" replace />;
    
    return <Outlet />;
};

export const RequireAdmin = () => {
    const { isAuthenticated, role } = useSelector((state) => state.auth);
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }
    if (role !== "admin") {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};
export const PreventAdmin = () => {
    const { isAuthenticated, role } = useSelector((state) => state.auth);
    if (isAuthenticated && role?.toLowerCase() === "admin") return <Navigate to="/admin/dashboard" replace />;
    return <Outlet />;
};