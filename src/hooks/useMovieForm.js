import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Joi from 'joi';
import axios from 'axios';
import toast from 'react-hot-toast';

const INITIAL_FORM_DATA = {
  movieName: '',
  genreIds: [],
  directorIds: [],
  castIds: [],
  locationIds: [],
  releaseDate: '',
  durationHour: '',
  durationMinute: '',
  synopsis: '',
  movieImage: null,
  cinemaDates: [],
  cinemaTimes: [],
};

const schema = Joi.object({
  movieName: Joi.string().trim().required().messages({
    'string.empty': 'Movie name cannot be empty',
    'any.required': 'Please input the movie name',
  }),
  genreIds: Joi.array().items(Joi.number()).min(1).required().messages({
    'array.min': 'Please select at least one category',
  }),
  directorIds: Joi.array().items(Joi.number()).min(1).required().messages({
    'array.min': 'Please select at least one director',
  }),
  castIds: Joi.array().items(Joi.number()).min(1).required().messages({
    'array.min': 'Please select at least one cast',
  }),
  locationIds: Joi.array().items(Joi.number()).min(1).required().messages({
    'array.min': 'Please select at least one location',
  }),
  releaseDate: Joi.string().required().messages({
    'string.empty': 'Release date cannot be empty',
  }),
  durationHour: Joi.number().min(0).required().messages({
    'number.base': 'Duration hour must be number',
    'number.min': 'Duration hour cannot less than 0',
    'any.required': 'Please input duration hour',
  }),
  durationMinute: Joi.number().min(0).max(59).required().messages({
    'number.base': 'Duration minute must be number',
    'number.min': 'Duration minute cannot less than 0',
    'number.max': 'The duration of minutes must not exceed 59 minutes',
    'any.required': 'Please input duration minute',
  }),
  synopsis: Joi.string().trim().required().messages({
    'string.empty': 'Synopsis cannot be empty',
  }),
  movieImage: Joi.any().invalid(null).required().messages({
  'any.invalid': 'Please select the movie poster image first!',
  'any.required': 'Please select the movie poster image first!',
  }),
  cinemaDates: Joi.array().min(1).required().messages({
    'array.min': 'Please select at least one cinema release date!',
  }),
  cinemaTimes: Joi.array().min(1).required().messages({
    'array.min': 'Please select at least one cinema times!',
  }),
});

const useMovieForm = (id, isEditMode) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});

  // Options state
  const [genreOptions, setGenreOptions] = useState([]);
  const [directorOptions, setDirectorOptions] = useState([]);
  const [castOptions, setCastOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [optionsLoaded, setOptionsLoaded] = useState(false);

  const [isDetailLoading, setIsDetailLoading] = useState(isEditMode);

  // --- FETCH OPTIONS ---
  useEffect(() => {
    const fetchAllOptions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/movie-options');
        setGenreOptions(response.data.genres || []);
        setDirectorOptions(response.data.directors || []);
        setCastOptions(response.data.casts || []);
        setLocationOptions(response.data.locations || []);
      } catch (error) {
        console.error('Failed to load movie options data:', error);
      } finally {
        setOptionsLoaded(true);
      }
    };
    fetchAllOptions();
  }, []);

  // --- FETCH DETAIL (edit mode) ---
  useEffect(() => {
    if (!isEditMode) return;

    const fetchMovieDetail = async () => {
      setIsDetailLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/admin/movies/${id}`);
        const data = response.data.data;

        let durationHour = '';
        let durationMinute = '';
        if (data.duration) {
          if (data.duration.includes(':')) {
            const parts = data.duration.split(':');
            durationHour = String(parseInt(parts[0], 10) || 0);
            durationMinute = String(parseInt(parts[1], 10) || 0);
          } else {
            const hourMatch = data.duration.match(/(\d+)\s*hour/);
            const minMatch = data.duration.match(/(\d+)\s*min/);
            durationHour = hourMatch ? String(parseInt(hourMatch[1], 10)) : '0';
            durationMinute = minMatch ? String(parseInt(minMatch[1], 10)) : '0';
          }
        }

        let releaseDate = '';
        if (data.release_date) {
          if (typeof data.release_date === 'string') {
            releaseDate = data.release_date.includes('T')
              ? data.release_date.split('T')[0]
              : data.release_date;
          } else {
            releaseDate = new Date(data.release_date).toISOString().split('T')[0];
          }
        }

        setFormData({
          movieName: data.title || '',
          genreIds: (data.genre_ids || []).map(Number),
          directorIds: (data.director_ids || []).map(Number),
          castIds: (data.cast_ids || []).map(Number),
          locationIds: (data.location_ids || []).map(Number),
          releaseDate,
          durationHour,
          durationMinute,
          synopsis: data.synopsis || '',
          movieImage: data.poster,
          cinemaDates: data.dates || [],
          cinemaTimes: data.times || [],
        });
      } catch (error) {
        console.error('Failed to load movie details:', error);
        toast.error('Failed to load movie data for editing.');
        navigate(-1);
      } finally {
        setIsDetailLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id, isEditMode, navigate]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'durationHour' && value !== '' && Number(value) < 0) return;
    if (name === 'durationMinute' && value !== '' && (Number(value) < 0 || Number(value) > 59)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleCheckboxChange = (e, fieldName) => {
    const value = Number(e.target.value);
    const isChecked = e.target.checked;
    setFormData((prev) => {
      const currentArray = prev[fieldName];
      if (isChecked) {
        if (currentArray.includes(value)) return prev;
        return { ...prev, [fieldName]: [...currentArray, value] };
      } else {
        return { ...prev, [fieldName]: currentArray.filter((item) => item !== value) };
      }
    });
    if (errors[fieldName]) setErrors((prev) => ({ ...prev, [fieldName]: null }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, movieImage: file }));
      if (errors.movieImage) setErrors((prev) => ({ ...prev, movieImage: null }));
    }
  };

  const handleAddDate = (tempDate, setTempDate) => {
    if (tempDate && !formData.cinemaDates.includes(tempDate)) {
      setFormData((prev) => ({ ...prev, cinemaDates: [...prev.cinemaDates, tempDate].sort() }));
      if (errors.cinemaDates) setErrors((prev) => ({ ...prev, cinemaDates: null }));
      setTempDate('');
    }
  };

  const handleRemoveDate = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      cinemaDates: prev.cinemaDates.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleToggleTime = (time) => {
    setFormData((prev) => {
      const isExist = prev.cinemaTimes.includes(time);
      return {
        ...prev,
        cinemaTimes: isExist
          ? prev.cinemaTimes.filter((t) => t !== time)
          : [...prev.cinemaTimes, time],
      };
    });
    if (errors.cinemaTimes) setErrors((prev) => ({ ...prev, cinemaTimes: null }));
  };

  const handleRemoveTime = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      cinemaTimes: prev.cinemaTimes.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = schema.validate(formData, { abortEarly: false });
    if (error) {
      const validationErrors = {};
      error.details.forEach((detail) => {
        validationErrors[detail.path[0]] = detail.message;
      });
      setErrors(validationErrors);
      return;
    }

    try {
      const dataToSend = new FormData();
      dataToSend.append('title', formData.movieName);
      dataToSend.append('release_date', formData.releaseDate);
      dataToSend.append('duration_hour', String(formData.durationHour));
      dataToSend.append('duration_minute', String(formData.durationMinute));
      dataToSend.append('synopsis', formData.synopsis);

      formData.genreIds.forEach((gId) => dataToSend.append('genre_ids', gId));
      formData.directorIds.forEach((dId) => dataToSend.append('director_ids', dId));
      formData.castIds.forEach((cId) => dataToSend.append('cast_ids', cId));
      formData.locationIds.forEach((lId) => dataToSend.append('location_ids', lId));
      formData.cinemaDates.forEach((date) => dataToSend.append('dates', date));
      formData.cinemaTimes.forEach((time) => dataToSend.append('times', time));

      if (formData.movieImage instanceof File) {
        dataToSend.append('poster', formData.movieImage);
      }

      if (isEditMode) {
        await axios.patch(`http://localhost:8080/api/admin/movies/${id}`, dataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Movies added success!');
      } else {
        await axios.post('http://localhost:8080/api/admin/movies', dataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Movies update success!');
      }

      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'an error occurred while saving the movie data.');
    }
  };

  const isChecked = (fieldName, optionId) => formData[fieldName].includes(Number(optionId));

  const setValue = (fieldName, value) => {
  setFormData((prev) => ({ ...prev, [fieldName]: value }));
  if (errors[fieldName]) setErrors((prev) => ({ ...prev, [fieldName]: null }));
};

  return {
    formData,
    errors,
    genreOptions,
    directorOptions,
    castOptions,
    locationOptions,
    optionsLoaded,
    isDetailLoading,
    handleChange,
    handleCheckboxChange,
    handleFileChange,
    handleAddDate,
    handleRemoveDate,
    handleToggleTime,
    handleRemoveTime,
    handleSubmit,
    isChecked,
    setValue,
  };
};

export default useMovieForm;