import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import { Player } from '@lottiefiles/react-lottie-player';
// import { Button } from '../components/atoms/Button';
import Stepper from '../components/molecules/Stepper';
import successAnimations from '../assets/animations/success-done.json'
import { useDispatch } from 'react-redux';
import { clearAuthForce } from '../redux/slices/authSlice';


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


                </main>
            </div>

        </>
    )
}

export default DonePage;