import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Stepper from "../components/molecules/Stepper";
import joi from "joi";
import { joiResolver } from '@hookform/resolvers/joi'
import { useForm } from "react-hook-form";
import InputField from "../components/atoms/Input";
import { Button } from "../components/atoms/Button";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordSlice, setResetPassEmail } from "../redux/slices/authSlice";

const schema = joi.object({
    email: joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.empty": "Email is required!",
            "string.email": "Invalid email format!",
            "any.required": "Email is required!",
        })
});
function CheckEmail() {
    const dispatch=useDispatch()
    const navigate = useNavigate()
    const {isLoading}= useSelector((state)=>state.auth)
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: joiResolver(schema)
    });
    const onSubmit = async(data) => {
        try {
            await dispatch(forgotPasswordSlice({email:data.email})).unwrap()
            dispatch(setResetPassEmail(data.email))
            toast.success('The OTP code has been sent to your email!', {
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
            setTimeout(() => navigate('/auth/check-email/verify-otp'), 2000);
        } catch (error) {
            toast.error(error || "Failed to send OTP. Please try again.");
        }
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
                        <Stepper steps={["Email", "OTP", "Reset"]} activeStep={0} />
                    </section>
                    <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
                        <InputField label='Email' type='email' id='email' placeholder='Enter your email address' required {...register('email')} />
                        <div className="h-2 w-full text-right">
                            {(errors.email) && (
                                <p className="text-important text-xs">
                                    {errors.email?.message}
                                </p>
                            )}
                        </div>

                        <Button type='submit' color='blue' size='full' shape='rectangle' className='hover:bg-blue-800' disabled={isLoading}>
                            {isLoading ? "Sending..." : "Send Code"}
                        </Button>
                    </form>
                    <p className="text-center text-sm text-darkgrey mt-6">
                        <Link to="/auth" className="text-primary hover:underline">Back to Login</Link>
                    </p>
                </main>
            </div>


        </>
    )
}

export default CheckEmail