import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import { Player } from '@lottiefiles/react-lottie-player';
// import { Button } from '../components/atoms/Button';
import Stepper from '../components/molecules/Stepper';
import successAnimations from '../assets/animations/success-done.json'
import { useDispatch } from 'react-redux';
import { clearAuthForce } from '../redux/slices/authSlice';
import AuthLayout from '../components/templates/AuthLayout';


function DonePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    // dispatch(clearAuthForce())

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/auth', { replace: true });
        }, 4000);

        return () => {
            clearTimeout(timer);
            // dispatch(clearAuthForce()); 
        };
    }, [navigate, dispatch]);
    return (
        <AuthLayout>s
            <section className='hidden sm:block '>
                <Stepper steps={["Fill Form", "Activate", "Done"]} activeStep={2} />
            </section>

            <div className="flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl font-bold text-darkgrey mb-3">
                    Yeay! Account Activated 🎉🥳
                </h1>
                <div className="w-40 h-40 mb-4 sm:w-48 sm:h-48">
                    <Player
                        src={successAnimations}
                        className="w-full h-full"
                        loop={true}
                        autoplay={true}
                    />
                </div>

                <p className='text-sm text-grey mb-8 px-4'>
                    Your account has been successfully verified. You will be redirected to the login page shortly.
                </p>
            </div>

        </AuthLayout>
    )
}

export default DonePage;