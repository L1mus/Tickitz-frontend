import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileSlice } from '../../redux/slices/userSlice';
import starIcon from '../../assets/images/star.svg';
import moreIcon from '../../assets/icons/more.svg';
import photoDefault from '../../assets/icons/user.png';

const photoSchema = Joi.object({
  photo: Joi.any()
    .required()
    .custom((value, helpers) => {
      if (!(value instanceof File)) {
        return helpers.error('any.invalid');
      }

      const maxUploadSize = 2 * 1024 * 1024;
      if (value.size > maxUploadSize) {
        return helpers.error('file.maxSize');
      }

      const allowedExt = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedExt.includes(value.type)) {
        return helpers.error('file.invalidExt');
      }
      return value;
    })
    .messages({
      'any.required': 'Please Select an Image File',
      'file.maxSize': 'File Too Large, Max. Size is 2MB',
      'file.invalidExt': 'Invalid File Format! JPG, JPEG or PNG Allowed',
    }),
});

function ProfileCard() {
  const dispatch = useDispatch();
  const { currentUser, isLoading } = useSelector((state) => state.user);

  const ASSET_URL = import.meta.env.VITE_ASSET_URL || 'http://localhost:8080';

  const { register, handleSubmit, setValue } = useForm({
    resolver: joiResolver(photoSchema),
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('photo', data.photo);

    const toastId = toast.loading('Loading...');

    dispatch(updateProfileSlice(formData))
      .unwrap()
      .then(() => {
        toast.success('Profile Photo Updated Successfully', { id: toastId });
      })
      .catch((err) => {
        toast.error(err || 'Failed to Update Profile Photo', { id: toastId });
      });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('photo', file);
      handleSubmit(onSubmit, onValidationError)();
    }
  };

  const onValidationError = (error) => {
    if (error.photo) {
      toast.error(error.photo.message);
    }
  };

  const getFullName = () => {
    if (currentUser?.full_name) return currentUser.full_name;
    if (currentUser?.first_name || currentUser?.last_name) {
      return `${currentUser.first_name || ' '} ${currentUser.last_name || ''}`.trim();
    }
    return currentUser?.email || 'User';
  };

  const currentPoints = currentUser?.point || 0;
  const targetPoints = 180;
  const progressPoints = Math.min((currentPoints / targetPoints) * 100, 100);

  const photoImg = currentUser?.photo
    ? `${ASSET_URL}${currentUser.photo}`
    : photoDefault;

  return (
    <section className="flex w-full flex-col gap-7 rounded-lg bg-white px-10 py-8 md:flex-2/5 md:p-10">
      <div className="mb-8 flex justify-between">
        <span>INFO</span>
        <img src={moreIcon} alt="more" />
      </div>

      <div className="relative flex justify-center">
        <label htmlFor="photo-upload" className="cursor-pointer">
          <img
            src={photoImg}
            alt="photo_profile"
            className="h-24 w-24 rounded-full object-cover shadow-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = photoDefault;
            }}
          />
        </label>
        <input
          type="file"
          id="photo-upload"
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
          disabled={isLoading}
          {...register('photo', {onChange: handlePhotoChange})}
          onChange={handlePhotoChange}
        />
      </div>

      <div className="mb-8 flex flex-col items-center justify-center">
        <span className="text-[20px] font-semibold">
          {isLoading ? 'Loading...' : getFullName()}
        </span>

        <span className="text-xsmall-bold text-grey">Moviegoers</span>
      </div>

      <div className="flex flex-col gap-6">
        <span className="text-medium-bold text-darkgrey">Loyalty Points</span>

        <div className="bg-primary relative flex h-40 flex-col items-start justify-between gap-2 overflow-hidden rounded-lg p-4 text-white">
          <span className="text-medium-bold">Moviegoers</span>
          <span className="text-large-bold">
            {currentPoints} <span className="text-small-normal">points</span>
          </span>

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-0 bottom-25 h-32 w-32 translate-x-8 rounded-full bg-[#FFFFFF4D]"></div>
            <div className="absolute right-0 bottom-20 h-32 w-32 translate-x-15 rounded-full bg-[#FFFFFF4D]"></div>
            <img src={starIcon} alt="star" className="absolute right-0" />
          </div>
        </div>

        <div className="mt-8 flex w-full flex-col items-center">
          <span className="text-medium-normal text-darkgrey">
            {currentPoints >= targetPoints
              ? 'You are a master!'
              : `${targetPoints - currentPoints} points become a master`}
          </span>

          <div className="h-4 w-full overflow-hidden rounded-lg bg-gray-300">
            <div
              className="rounded-lg h-full bg-blue-800"
              style={{
                width: `${progressPoints}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileCard;
