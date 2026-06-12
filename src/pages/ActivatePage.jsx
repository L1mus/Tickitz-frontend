import { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from '../components/atoms/Button';
import Stepper from '../components/molecules/Stepper';
import OtpInput from '../components/molecules/OTP';
import { activateSlice } from '../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { resendOTPAPI } from '../services/authServices';


function ActivatePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { registeredEmail, isLoading } = useSelector((state) => state.auth);

    const [otp, setOtp] = useState(new Array(6).fill(''));
    const inputRefs = useRef([]);
    const [countdown, setCountdown] = useState(300);
    const [isResending, setIsResending] = useState(false);

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

    const onSubmit = (e) => {
        e.preventDefault();
        const otpCode = otp.join("");

        if (otpCode.length < 6) {
            toast.error("Kode OTP harus 6 digit!");
            return;
        }
        const payload = {
            email: registeredEmail,
            otp: otpCode
        };
        // console.log("Kode OTP untuk verifikasi:", otpCode);
        dispatch(activateSlice(payload))
            .unwrap()
            .then(() => {
                toast.success('Activation success', {
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
                navigate('/auth/register/activate/done', { replace: true })
            })
            .catch((err) => {
                toast.error(err || "Activation failed, Try again!");
            })
    };

    const backgrounds = [
        '/src/assets/images/bg-auth.svg',
        '/src/assets/images/bg-auth-2.jpg',
        '/src/assets/images/bg-auth-3.jpg'
    ];

    const [currentBg, setCurrentBg] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % backgrounds.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [backgrounds.length]);
    const handleResendOTP = async () => {
        if (countdown > 0 || isResending) return; 

        setIsResending(true);
        try {
            await resendOTPAPI({ email: registeredEmail });
            toast.success("OTP baru telah dikirim ke email Anda!");
            setCountdown(60);
            setOtp(new Array(6).fill(''));
            if (inputRefs.current[0]) inputRefs.current[0].focus(); 
        } catch (error) {
            toast.error(error?.response?.data?.message || "Gagal mengirim ulang OTP");
        } finally {
            setIsResending(false);
        }
    };
    return (
        <>
            <div className='min-h-screen relative flex flex-col items-center justify-center px-4 py-8 font-main'>
                {backgrounds.map((bg, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 z-0 bg-black/40 bg-blend-overlay bg-no-repeat bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentBg ? 'opacity-100' : 'opacity-0'
                            }`}
                        style={{ backgroundImage: `url('${bg}')` }}
                    />
                ))}
                <section className="mb-8 flex justify-center"><img src='/src/assets/images/tickitz-white.svg' className="z-10 w-40 md:w-50 lg:w-60" /></section>
                <main className='bg-white z-10 p-8 rounded-lg shadow-lg w-full md:min-3/6 max-w-lg'>

                    <section className='hidden sm:block mb-6'>
                        <Stepper steps={["Fill Form", "Activate", "Done"]} activeStep={1} />
                    </section>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-darkgrey mb-2">
                            Activate Account
                        </h1>
                        <p className='text-sm text-grey'>
                            We have sent a 6-digit verification code to your email.
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

                        <Button type='submit' color='blue' size='full' shape='rectangle' className={`mt-8 hover:bg-blue-800 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isLoading}>
                            {isLoading ? 'Activation...' : 'Activate Now'}
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
                </main>
            </div>

        </>
    )
}

export default ActivatePage;