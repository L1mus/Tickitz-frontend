import { useEffect, useState } from 'react';

const AuthLayout = ({ children }) => {
    const backgrounds = [
        '/src/assets/images/bg-auth.jpg',
        '/src/assets/images/bg-auth-2.jpg',
        '/src/assets/images/bg-auth-3.jpg',
        '/src/assets/images/bg-auth-4.jpg',
        '/src/assets/images/bg-auth-5.jpg',
        '/src/assets/images/bg-auth-6.jpg',
        '/src/assets/images/bg-auth-7.jpg',
    ];

    const [currentBg, setCurrentBg] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % backgrounds.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [backgrounds.length]);

    return (
        <div className="font-main relative flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-2">
            {/* Background Slider */}
            {backgrounds.map((bg, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 z-0 bg-black/40 bg-cover bg-center bg-no-repeat bg-blend-overlay transition-opacity duration-1000 ease-in-out ${
                        index === currentBg ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ backgroundImage: `url('${bg}')` }}
                />
            ))}

            {/* Logo Tickitz */}
            <section className="mb-8 flex justify-center">
                <img
                    src="/src/assets/images/tickitz-white.svg"
                    alt="Tickitz Logo"
                    className="z-10 w-40 md:w-50 lg:w-60"
                />
            </section>

            {/* Main Content Box (Form akan masuk ke sini) */}
            <main className="md:min-3/6 z-10 w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
                {children}
            </main>
        </div>
    );
};

export default AuthLayout;