import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import InputField from '../components/atoms/Input';
import { Button } from '../components/atoms/Button';
import Stepper from '../components/molecules/Stepper';
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordSlice, clearResetFlow } from '../redux/slices/authSlice';
import AuthLayout from '../components/templates/AuthLayout';

const schema = joi.object({
    new_password: joi.string().min(8).required().messages({
        'string.empty': 'New password is required!',
        'string.min': 'Password must be at least 8 characters!',
        'any.required': 'New password is required!',
    }),
    confirm_password: joi
        .any()
        .valid(joi.ref('new_password'))
        .required()
        .messages({
            'any.only': 'Passwords do not match!',
            'any.required': 'Please confirm your password!',
        }),
});
function ForgotPassword() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { isLoading, resetPassEmail, isResetOtpVerified } = useSelector((state) => state.auth);
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: joiResolver(schema),
    });
    const onSubmit = async (data) => {
        try {
            await dispatch(resetPasswordSlice({
                email: resetPassEmail,
                new_password: data.new_password
            })).unwrap();
            toast.success('Password changed successfully!', {
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
            dispatch(clearResetFlow());
            setTimeout(() => navigate('/auth'), 2000);
        } catch (error) {
            toast.error(error || "Failed to reset password. Session might be expired.");
        }
    };
    // useEffect(() => {
    //     if (!resetPassEmail || !isResetOtpVerified) {
    //         toast.error("Unauthorized access. Please verify OTP first.");
    //     }
    // }, [resetPassEmail, isResetOtpVerified, navigate]);

    return (
        <AuthLayout>
            <section className="mb-8 flex justify-center">
                <img
                    src="/src/assets/images/tickitz-white.svg"
                    className="z-10 w-40 md:w-50 lg:w-60"
                />
            </section>
            <main className="md:min-3/6 z-10 w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
                <section className="mb-6 hidden sm:block">
                    <Stepper steps={['Email', 'OTP', 'Reset']} activeStep={2} />
                </section>
                <section>
                    <h1 className="text-darkgrey mb-2 text-center text-2xl font-bold">
                        Reset Password
                    </h1>
                    <p className="text-grey mb-6 text-center text-sm">
                        Create a new, secure password for your account
                    </p>
                </section>
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <InputField
                        label="New Password"
                        type="password"
                        id="new_password"
                        placeholder="Write your new password"
                        {...register('new_password')}
                    />
                    <InputField
                        label="Confirm Password"
                        type="password"
                        id="confirm_password"
                        placeholder="Write your confirm password"
                        {...register('confirm_password')}
                    />
                    <div className="h-2 w-full text-right">
                        {(errors.new_password || errors.confirm_password) && (
                            <p className="text-important text-xs">
                                {errors.new_password?.message ||
                                    errors.confirm_password?.message}
                            </p>
                        )}
                    </div>

                    <Button type="submit" color="blue" size="full" shape="rectangle" className="hover:bg-blue-800" disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : "Save"}
                    </Button>
                </form>
            </main>

        </AuthLayout>
    );
}

export default ForgotPassword;
