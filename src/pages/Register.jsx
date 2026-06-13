import { useEffect, useState } from 'react';
import joi from 'joi';
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import InputField from '../components/atoms/Input';
import { Button } from '../components/atoms/Button';
import Stepper from '../components/molecules/Stepper';
import { useDispatch, useSelector } from 'react-redux';
import { registerSlice } from '../redux/slices/authSlice';

const schema = joi.object({
    email: joi.string()
        .email({ tlds: { allow: false } }).required().messages({
            "string.empty": "Email is required!",
            "string.email": "Invalid email format!",
            "any.required": "Email is required!",
        }),
    password: joi.string().min(8).required().messages({
        "string.empty": "Password is required!",
        "string.min": "Password must be at least 8 characters!",
        "any.required": "Password is required!",
    }),
    terms: joi.boolean().valid(true).required().messages({
        "any.only": "You must agree to the terms and conditions!",
        "any.required": "You must agree to the terms and conditions!",
    })
});

function Register() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isLoading } = useSelector((state) => state.auth);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: joiResolver(schema)
    });

    const onSubmit = (data) => {
        // console.log("Data Login:", data);
        // toast.success("Register berhasil!");
        const payload = {
            email: data.email,
            password: data.password,
            agree_terms: data.terms
        };
        dispatch(registerSlice(payload))
            .unwrap()
            .then(() => {
                console.log("Data Login:", payload);
                toast.success('Register success', {
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
                navigate('/auth/register/activate', { replace: true })
            })
            .catch((err) => {
                toast.error(err || "Register failed, Try again!");
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
    return (
        <>
            <div className="font-main relative flex min-h-screen flex-col items-center justify-center px-4 py-8">
                {backgrounds.map((bg, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 z-0 bg-black/40 bg-cover bg-center bg-no-repeat bg-blend-overlay transition-opacity duration-1000 ease-in-out ${index === currentBg ? 'opacity-100' : 'opacity-0'
                            }`}
                        style={{ backgroundImage: `url('${bg}')` }}
                    />
                ))}
                <section className="mb-8 flex justify-center">
                    <img
                        src="/src/assets/images/tickitz-white.svg"
                        className="z-10 w-40 md:w-50 lg:w-60"
                    />
                </section>
                <main className="md:min-3/6 z-10 w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
                    <section className="hidden sm:block">
                        <Stepper steps={['Fill Form', 'Activate', 'Done']} activeStep={0} />
                    </section>
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <InputField
                            label="Email"
                            type="email"
                            id="email"
                            placeholder="Write your email"
                            {...register('email')}
                        />

                        <InputField
                            label="Password"
                            type="password"
                            id="password"
                            placeholder="Write your password"
                            {...register('password')}
                        />
                        <div className="h-2 w-full text-right">
                            {(errors.email || errors.password || errors.terms) && (
                                <p className="text-important text-xs">
                                    {errors.email?.message ||
                                        errors.password?.message ||
                                        errors.terms?.message}
                                </p>
                            )}
                        </div>
                        <div className="mt-4 flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="terms"
                                className="text-primary focus:ring-primary mt-1 h-4 w-4 rounded border-gray-300 bg-gray-100"
                                {...register('terms')}
                            />
                            <label htmlFor="terms" className="text-darkgrey text-sm">
                                I agree to terms & conditions
                            </label>
                        </div>

                        <Button type='submit' color='blue' size='full' shape='rectangle' className={`hover:bg-blue-800 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isLoading}>
                            {isLoading ? 'Processing...' : 'Join For Free Now'}
                        </Button>
                    </form>
                    <section className='mt-5'>
                        <div className="flex items-center justify-center gap-20 mb-5">
                            <div className="h-px flex-1 bg-grey"></div>
                            <span className="text-grey">Or</span>
                            <div className="h-px flex-1 bg-grey"></div>
                        </div>
                        <div className='flex gap-5 justify-center items-center'>
                            <Button color='white' size='medium' shape='rectangle' className='hover:bg-primary '>
                                <a className='flex items-center justify-center gap-2 '><img src='/src/assets/icons/google-auth.svg' /><span className='hidden md:block text-darkgrey hover:text-white'>Google</span></a>
                            </Button>
                            <Button color='white' size='medium' shape='rectangle' className='hover:bg-primary '>
                                <a className='flex items-center justify-center gap-2'><img src='/src/assets/icons/fb-auth.svg' /><span className='hidden md:block text-darkgrey hover:text-white'>Facebook</span></a>
                            </Button>
                        </div>
                    </section>
                    <div className='flex justify-center mt-4 text-center gap-2 text-sm text-darkgrey'>
                        Already have an account?
                        <Link
                            to="/auth"
                            title="Sign in "
                            className="text-primary cursor-pointer font-semibold hover:underline"
                        >
                            Login
                        </Link>
                    </div>
                </main>
            </div>

        </>
    )
}

export default Register;
