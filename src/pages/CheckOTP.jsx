import { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from '../components/atoms/Button';
import Stepper from '../components/molecules/Stepper';
import OtpInput from '../components/molecules/OTP';
import { useDispatch, useSelector } from 'react-redux';
import { verifyResetOtpSlice, forgotPasswordSlice } from '../redux/slices/authSlice';
import AuthLayout from '../components/templates/AuthLayout';

function CheckOTP() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { isLoading, resetPassEmail } = useSelector((state) => state.auth)

    const [otp, setOtp] = useState(new Array(6).fill(''));
    const inputRefs = useRef([]);
    const [countdown, setCountdown] = useState(10);
    const [isResending, setIsResending] = useState(false);
    useEffect(() => {
        if (!resetPassEmail) {
            toast.error("Please enter your email first!");
            navigate('/auth/check-email', { replace: true });
        }
    }, [resetPassEmail, navigate]);
    useEffect(() => {
        if (countdown > 0) {
            const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [countdown]);
    const handleChange = (value, index) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
        if (pastedData.some(isNaN)) return;

        const newOtp = [...otp];
        pastedData.forEach((char, i) => {
            if (i < 6) newOtp[i] = char;
        });
        setOtp(newOtp);

        const focusIndex = pastedData.length < 6 ? pastedData.length : 5;
        if (inputRefs.current[focusIndex]) {
            inputRefs.current[focusIndex].focus();
        }
    };
    const onSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join("");
        if (otpCode.length < 6) return toast.error("OTP code must 6 digit!");
        try {
            await dispatch(verifyResetOtpSlice({ email: resetPassEmail, otp: otpCode })).unwrap();
            toast.success('Code verified!', {
                style: {
                    border: '1px solid #00D452',
                    padding: '16px',
                    color: '#00D452',
                },
                iconTheme: {
                    primary: '#00D452',
                    secondary: '#FFFAEE',
                },
            });
            setTimeout(() => navigate('/auth/check-email/verify-otp/reset'), 2000);
        } catch (error) {
            toast.error(error || "Invalid or expired OTP code");
        }
    };
    const handleResendOTP = async () => {
        if (countdown > 0 || isResending) return;
        setIsResending(true);
        try {
            await dispatch(forgotPasswordSlice({ email: resetPassEmail })).unwrap();
            toast.success("A new OTP code has been sent to your email!");
            setCountdown(300);
            setOtp(new Array(6).fill(''));
            if (inputRefs.current[0]) inputRefs.current[0].focus();
        } catch (error) {
            setIsResending(false);
            toast.error(error || "Failed to resend OTP");
        }
    };

    return (
        <AuthLayout>
            <section className='hidden sm:block mb-6'>
                <Stepper steps={["Email", "OTP", "Reset"]} activeStep={1} />
            </section>

            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-darkgrey mb-2">
                    Verify Token OTP
                </h1>
                <p className='text-sm text-grey'>
                    We have sent a 6-digit verification code to <span className="font-semibold text-darkgrey">{resetPassEmail}</span>
                </p>
            </div>

            <form onSubmit={onSubmit}>
                <OtpInput
                    otp={otp}
                    inputRefs={inputRefs}
                    handleChange={handleChange}
                    handleKeyDown={handleKeyDown}
                    handlePaste={handlePaste}
                />

                <Button type='submit' color='blue' size='full' shape='rectangle' className='mt-8 hover:bg-blue-800' disabled={isLoading || isResending}>
                    {isLoading ? "Process..." : "Verification"}
                </Button>
            </form>
            <div className="mt-6 text-center text-sm text-darkgrey">
                Didn't receive the code?{" "}
                <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || isResending}
                    className={`font-semibold transition-colors ${countdown > 0 || isResending ? 'text-grey cursor-not-allowed' : 'text-primary hover:underline cursor-pointer'}`}
                >
                    {isResending ? 'Sending...' : (countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP')}
                </button>
            </div>

        </AuthLayout>
    )
}

export default CheckOTP