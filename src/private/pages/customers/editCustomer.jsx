import InputText from '../../../ui/inputText';
import InputRadio from '../../../ui/customRadio';
import BackButton from '../../../ui/backButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema } from '../../../forms/customer.schema';
import useToast from '../../../toast/useToast';
import api from '../../../api/api';
import { useEnterNavigation } from '../../../forms/utils/useEnterNavigation';
import { focusFirstError } from '../../../forms/utils/focusFirstError';
import CustomSelect from '../../../ui/customSelect';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import ImageUploader from '../../../ui/imageUploader';

const DIVISIONS = [
  { label: 'Dhaka', value: 'Dhaka' },
  { label: 'Chattogram', value: 'Chattogram' },
  { label: 'Rajshahi', value: 'Rajshahi' },
  { label: 'Khulna', value: 'Khulna' },
  { label: 'Barishal', value: 'Barishal' },
  { label: 'Sylhet', value: 'Sylhet' },
  { label: 'Rangpur', value: 'Rangpur' },
  { label: 'Mymensingh', value: 'Mymensingh' },
];

const DISTRICTS = [
  { label: 'Bagerhat', value: 'Bagerhat' },
  { label: 'Bandarban', value: 'Bandarban' },
  { label: 'Barguna', value: 'Barguna' },
  { label: 'Barishal', value: 'Barishal' },
  { label: 'Bhola', value: 'Bhola' },
  { label: 'Bogra', value: 'Bogra' },
  { label: 'Brahmanbaria', value: 'Brahmanbaria' },
  { label: 'Chandpur', value: 'Chandpur' },
  { label: 'Chattogram', value: 'Chattogram' },
  { label: 'Chuadanga', value: 'Chuadanga' },
  { label: "Cox's Bazar", value: 'Coxsbazar' },
  { label: 'Cumilla', value: 'Cumilla' },
  { label: 'Dhaka', value: 'Dhaka' },
  { label: 'Dinajpur', value: 'Dinajpur' },
  { label: 'Faridpur', value: 'Faridpur' },
  { label: 'Feni', value: 'Feni' },
  { label: 'Gaibandha', value: 'Gaibandha' },
  { label: 'Gazipur', value: 'Gazipur' },
  { label: 'Gopalganj', value: 'Gopalganj' },
  { label: 'Habiganj', value: 'Habiganj' },
  { label: 'Jamalpur', value: 'Jamalpur' },
  { label: 'Jashore', value: 'Jashore' },
  { label: 'Jhalokati', value: 'Jhalokati' },
  { label: 'Jhenaidah', value: 'Jhenaidah' },
  { label: 'Joypurhat', value: 'Joypurhat' },
  { label: 'Khagrachhari', value: 'Khagrachhari' },
  { label: 'Khulna', value: 'Khulna' },
  { label: 'Kishoreganj', value: 'Kishoreganj' },
  { label: 'Kurigram', value: 'Kurigram' },
  { label: 'Kushtia', value: 'Kushtia' },
  { label: 'Lakshmipur', value: 'Lakshmipur' },
  { label: 'Lalmonirhat', value: 'Lalmonirhat' },
  { label: 'Madaripur', value: 'Madaripur' },
  { label: 'Magura', value: 'Magura' },
  { label: 'Manikganj', value: 'Manikganj' },
  { label: 'Meherpur', value: 'Meherpur' },
  { label: 'Moulvibazar', value: 'Moulvibazar' },
  { label: 'Munshiganj', value: 'Munshiganj' },
  { label: 'Mymensingh', value: 'Mymensingh' },
  { label: 'Naogaon', value: 'Naogaon' },
  { label: 'Narail', value: 'Narail' },
  { label: 'Narayanganj', value: 'Narayanganj' },
  { label: 'Narsingdi', value: 'Narsingdi' },
  { label: 'Natore', value: 'Natore' },
  { label: 'Netrokona', value: 'Netrokona' },
  { label: 'Nilphamari', value: 'Nilphamari' },
  { label: 'Noakhali', value: 'Noakhali' },
  { label: 'Pabna', value: 'Pabna' },
  { label: 'Panchagarh', value: 'Panchagarh' },
  { label: 'Patuakhali', value: 'Patuakhali' },
  { label: 'Pirojpur', value: 'Pirojpur' },
  { label: 'Rajbari', value: 'Rajbari' },
  { label: 'Rajshahi', value: 'Rajshahi' },
  { label: 'Rangamati', value: 'Rangamati' },
  { label: 'Rangpur', value: 'Rangpur' },
  { label: 'Satkhira', value: 'Satkhira' },
  { label: 'Shariatpur', value: 'Shariatpur' },
  { label: 'Sherpur', value: 'Sherpur' },
  { label: 'Sirajganj', value: 'Sirajganj' },
  { label: 'Sunamganj', value: 'Sunamganj' },
  { label: 'Sylhet', value: 'Sylhet' },
  { label: 'Tangail', value: 'Tangail' },
  { label: 'Thakurgaon', value: 'Thakurgaon' },
];

const CITIES = [
  { label: 'Dhaka', value: 'Dhaka' },
  { label: 'Chattogram', value: 'Chattogram' },
  { label: 'Gazipur', value: 'Gazipur' },
  { label: 'Narayanganj', value: 'Narayanganj' },
  { label: 'Khulna', value: 'Khulna' },
  { label: 'Rajshahi', value: 'Rajshahi' },
  { label: 'Sylhet', value: 'Sylhet' },
  { label: 'Bogura', value: 'Bogura' },
  { label: 'Mymensingh', value: 'Mymensingh' },
  { label: 'Barishal', value: 'Barishal' },
  { label: 'Rangpur', value: 'Rangpur' },
  { label: 'Cumilla', value: 'Cumilla' },
  { label: 'Faridpur', value: 'Faridpur' },
  { label: 'Jashore', value: 'Jashore' },
  { label: "Cox's Bazar", value: 'Coxsbazar' },
  { label: 'Tongi', value: 'Tongi' },
  { label: 'Savar', value: 'Savar' },
  { label: 'Narsingdi', value: 'Narsingdi' },
  { label: 'Sirajganj', value: 'Sirajganj' },
  { label: 'Pabna', value: 'Pabna' },
  { label: 'Dinajpur', value: 'Dinajpur' },
  { label: 'Kushtia', value: 'Kushtia' },
  { label: 'Tangail', value: 'Tangail' },
  { label: 'Brahmanbaria', value: 'Brahmanbaria' },
  { label: 'Feni', value: 'Feni' },
  { label: 'Noakhali', value: 'Noakhali' },
  { label: 'Chandpur', value: 'Chandpur' },
  { label: 'Lakshmipur', value: 'Lakshmipur' },
  { label: 'Patuakhali', value: 'Patuakhali' },
  { label: 'Bhola', value: 'Bhola' },
];

export default function EditCustomer() {
  const toast = useToast();
  const { id } = useParams();
  const cusId = parseInt(id);
  const navigate = useNavigate(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      division: '',
      district: '',
      city: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const res = await api.get(`/customers/${cusId}/details`);
        const customer = res.data;
        reset(res.data);
        if (customer.image_url) {
          setExistingImage(customer.image_url);
          setImagePreview(customer.image_url);
        }
      } catch (err) {
        console.error(err.message);
        if (err.response?.status === 404) {
          toast.error('Customer not found');
          navigate(-1);
        }
      }
    }

    fetchCustomer();
  }, [cusId, reset, toast,navigate]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  },[imagePreview]);

  const onSubmit = async (data) => {
    if (!isDirty) {
      toast.info('No changes detected');
      return;
    }
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if(k === 'image') return ;
      if (v !== undefined && v !== null) formData.append(k, v);
    });

    if (imageError) {
      toast.error(imageError);
      return;
    }
    
    if (imageFile instanceof File) {
      formData.append('image', imageFile);
    } else if (!imagePreview && existingImage) {
      formData.append('removeImage', 'true');
    }
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }
    try {
      await api.put(`/customers/${cusId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success("Customer updated successfully!");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error('Customer update failed!');
    }
  };

  const enterNavigation = useEnterNavigation({
    errors,
    submit: handleSubmit(onSubmit),
  });

  const onError = (errors) => {
    // console.log(errors);
    focusFirstError(errors);
  };

  return (
    <div className="bg-gray-100 overflow-y-auto w-full min-h-screen flex justify-center text-[#030006]">
      <div className="m-5 mb-10 p-3 w-full max-w-[1000px] rounded-xl bg-gradient-to-r from-sky-100 to-cyan-100 shadow-lg border border-gray-200">
        <div className="text-[28px] mb-10 font-semibold font-serif flex justify-center ">
          Edit Customer
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          onKeyDown={enterNavigation}
          className="space-y-6"
        >
          <div className="flex gap-5 justify-between">
            {/* Left Column */}
            <div className="w-[45%] space-y-3">
              <InputText
                label="Name"
                name="name"
                register={register}
                placeholder="Enter Name . . ."
                onlyText
                maxLength={30}
                error={errors.name?.message}
                required
              />
              <InputText
                label="Birthday"
                type="date"
                name="birthday"
                register={register}
                error={errors.birthday?.message}
                required
              />

              <InputText
                label="Phone"
                name="phone"
                onlyNumber
                placeholder=" 01xxxxxxxxx"
                register={register}
                error={errors.phone?.message}
                required
              />
              <InputText
                label="Alt Phone"
                name="alt_phone"
                onlyNumber
                placeholder=" 01xxxxxxxxx"
                register={register}
                error={errors.alt_phone?.message}
              />
              <InputText
                label="Whatsapp"
                name="whatsapp"
                onlyNumber
                placeholder=" 01xxxxxxxxx"
                register={register}
                error={errors.whatsapp?.message}
              />
              <InputText
                label="Email"
                name="email"
                placeholder=" Enter Your Email . . ."
                register={register}
                error={errors.email?.message}
                required
              />
              <CustomSelect
                name="division"
                label="Division"
                placeholder="Select Division"
                options={DIVISIONS}
                value={watch('division')}
                onChange={(val) =>
                  setValue('division', val, { shouldValidate: true, shouldDirty:true })
                }
                error={errors.division?.message}
                required
              />
            </div>

            {/* Right Column */}
            <div className="w-[45%] space-y-3">
              <CustomSelect
                name="district"
                label="District"
                placeholder="Select District"
                options={DISTRICTS}
                value={watch('district')}
                onChange={(val) =>
                  setValue('district', val, { shouldValidate: true, shouldDirty:true, })
                }
                error={errors.district?.message}
                required
              />

              <CustomSelect
                name="city"
                label="City"
                placeholder="Select City"
                options={CITIES}
                value={watch('city')}
                onChange={(val) =>
                  setValue('city', val, { shouldValidate: true, shouldDirty:true })
                }
                error={errors.city?.message}
              />
              <InputText
                label="Area"
                name="area"
                placeholder="Enter Your Area . . ."
                register={register}
                error={errors.area?.message}
              />
              <InputText
                label="Post Code"
                name="post_code"
                onlyNumber
                maxLength={4}
                placeholder="Enter 4 digit code"
                register={register}
                error={errors.post_code?.message}
                required
              />

              <InputText
                label="Sector"
                name="sector"
                placeholder="Sector Name . . ."
                register={register}
                error={errors.sector?.message}
              />
              <InputText
                label="Road"
                name="road"
                placeholder="Road No . . ."
                register={register}
                error={errors.road?.message}
              />
              <InputText
                label="House"
                name="house"
                placeholder="House No . . ."
                register={register}
                error={errors.house?.message}
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <InputRadio
              label="Gender"
              name="gender"
              register={register}
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Other', value: 'other' },
              ]}
              error={errors.gender?.message}
              required
            />
          </div>

          <ImageUploader
            label="Customer Image"
            value={imagePreview}
            error={errors.image?.message || imageError}
            onFileSelect={(file, err) => {
              setImageError(err);
              if (imagePreview?.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
              }
              if (file) {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
                setValue('image', file, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              } else {
                setImageFile(null);
                setImagePreview(null);
                setValue('image', null, { shouldDirty: true });
              }
            }}
          />

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <div className="text-red-700 hover:scale-105">
              <BackButton />
            </div>

            <button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="bg-blue-500 text-white px-6 py-2 rounded-xl
                        hover:bg-red-600 disabled:opacity-60 cursor-pointer from-indigo-700 to-blue-600 bg-gradient-to-b hover:bg-gradient-to-r
                          disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
