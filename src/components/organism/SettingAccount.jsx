import Joi from 'joi';
import InputField from '../atoms/Input';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { useEffect } from 'react';
import { updateProfileSlice } from '../../redux/slices/userSlice';
import toast from 'react-hot-toast';

const profileSchema = Joi.object({
  first_name: Joi.string().allow('').max(50).label('First Name'),
  last_name: Joi.string().allow('').max(50).label('last_name'),
  phone: Joi.string()
    .allow('')
    .pattern(/^[0-9]+$/)
    .messages({
      'string.pattern.base': 'Phone number must contain only numbers',
    })
    .label('Phone Number'),
  new_password: Joi.string()
    .allow('')
    .min(6)
    .messages({
      'string.min': 'New Password Must be at Least 6 Characters',
    })
    .label('New Password'),
  confirm_password: Joi.string()
    .allow('')
    .valid(Joi.ref('new_password'))
    .messages({
      'any.only': 'Confirm Password Does Not Match New Password',
    })
    .label('Confirm Password'),
});

function SettingAccount() {
  const dispatch = useDispatch();
  const { currentUser, isLoading } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(profileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      new_password: '',
      confirm_password: '',
    },
  });

  useEffect(() => {
    if (currentUser) {
      reset({
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        phone: currentUser.phone || '',
        new_password: '',
        confirm_password: '',
      });
    }
  }, [currentUser, reset]);

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('phone', data.phone);

    if (data.new_password) {
      formData.append('new_password', data.new_password);
      formData.append('confirm_password', data.confirm_password);
    }

    const toastId = toast.loading("Loading...")

    dispatch(updateProfileSlice(formData))
        .unwrap()
        .then(() => {
            toast.success("Profile Updated Succesfully", {id: toastId})
            reset({
                ...data,
                new_password: "",
                confirm_password: ""
            })
        })
        .catch((err) => {
            toast.error(err || "Failed To Update Profile ", {id:toastId})
        })
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-darkgrey w-full">
      <div className="rounded-lg bg-white p-10">
        <h2 className="text-large-bold border-grey mb-6 border-b-2 pb-2 text-black">
          Details Information
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:text-xl">
          <div>
            <label className="mb-1">First Name</label>
            <InputField
              placeholder="Input Your First Name"
              className="w-full"
              {...register("first_name")}
            />
            {errors.first_name && 
                <p className='text-red-500 text-small=normal mt-1'>{errors.first_name.message}</p>
            }
          </div>

          <div>
            <label className="mb-1">Last Name</label>
            <InputField
                 placeholder="Input Your Last Name"
                 className="w-full"
                 {...register("last_name")}
                 />
                 {errors.last_name &&
                    <p className='text-red-500 text-small=normal mt-1'>{errors.last_name.message}</p>                 
                 }
          </div>

          <div>
            <label className="mb-1">Email</label>
            <InputField 
                placeholder="Input Your Email"
                className="w-full bg-gray-100 text-gray-400 cursor-not-allowed"
                value={currentUser?.email || ""}
                disabled
             />
          </div>

          <div>
            <label className="mb-1">Phone</label>
            <InputField
                 placeholder="Input Your Phone Number"
                 className = "w-full"
                 {...register("phone")}
              />
                {errors.phone &&
                    <p className='text-red-500 text-small=normal mt-1'>{errors.phone.message}</p>
                }
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-10 md:mt-10 md:text-xl">
        <div>
          <h2 className="text-large-bold border-grey mb-6 border-b-2 pb-2 text-black">
            Change Password
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1">New Password</label>
              <InputField 
                type="password" 
                placeholder="Input New Password" 
                {...register("new_password")}
                />
                {errors.new_password &&
                    <p className='text-red-500 text-small-normal mt-1'>{errors.new_password.message}</p>
                }
            </div>

            <div>
              <label className="mb-1">Confirm Password</label>
              <InputField
                type="password"
                placeholder="Input Confirm password"
                {...register("confirm_password")}
              />
              {errors.confirm_password &&
                     <p className='text-red-500 text-small-normal mt-1'>{errors.confirm_password.message}</p>
              }
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center md:mt-10 md:justify-start">
        <button
          type="submit"
          disabled= {isLoading}
          className="bg-primary cursor-pointer text-white text-medium-normal py-2 px-6 md:px-36 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Loading..." : "Update Change"}
        </button>
      </div>
    </form>
  );
}


export default SettingAccount;
