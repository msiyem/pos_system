import { useState } from 'react';
import InputText from '../../ui/inputText.jsx';
import InputRadio from '../../ui/radio.jsx';
import BackButton from '../../ui/backButton.jsx';
import API from '../../../api/api.js';
export default function AddSupplier() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthday: '',
    division: '',
    district: '',
    city: '',
    area: '',
    post_code: '',
    sector: '',
    road: '',
    house: '',
    phone: '',
    alt_phone: '',
    whatsapp: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gender validation
    if (!formData.gender) {
      alert('Error! Please select a gender!');
      return;
    }

    // Phone validation
    if (formData.phone.length !== 11) {
      alert('Error! Phone number must be exactly 11 digits!');
      return;
    }

    //Alternative phone validation
    if (formData.alt_phone && formData.alt_phone.length !== 11) {
      alert('Error! Alternative phone must be exactly 11 digits!');
      return;
    }

    //Whatsapp number validation
    if (formData.whatsapp && formData.whatsapp.length !== 11) {
      alert('Error! Whatsapp number must be exactly 11 digits!');
      return;
    }

    try {
      const res=await API.post('/suppliers',{
      name:formData.name,
      gender:formData.gender,
      birthday: formData.birthday,
      phone: formData.phone,
      alt_phone: formData.alt_phone,
      whatsapp: formData.whatsapp,
      email: formData.email,
      division: formData.division,
      district: formData.district,
      city: formData.city,
      area: formData.area,
      post_code: formData.post_code,
      sector: formData.sector,
      road: formData.road,
      house: formData.house
      })

      alert('Supplier added successfully! ID: ' + res.data.supplierId);

      // Reset form
      setFormData({
        name: '',
        gender: '',
        birthday: '',
        division: '',
        district: '',
        city: '',
        area: '',
        post_code: '',
        sector: '',
        road: '',
        house: '',
        phone: '',
        alt_phone: '',
        whatsapp: '',
        email: '',
      });
    } catch (err) {
      console.error(err);
      alert('Error adding supplier');
    }
  };

  return (
    <div className="bg-gray-100 overflow-y-auto w-full min-h-screen flex justify-center text-[#030006]">
      <div className="m-5 mb-10 p-3 w-full max-w-[1000px] rounded-xl bg-red-100 ">
        <div className="text-[28px] mb-10 font-semibold font-serif flex justify-center ">
          Add Supplier
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <InputText
            title="Name"
            type="text"
            name="name"
            placeholder="Enter Name..."
            formData={formData}
            handleChange={handleChange}
            required
          />

          {/* Gender Radio */}
          <div className="flex gap-2 items-center w-full">
            <div className="w-[18ch] flex justify-between">
              <span className="font-semibold  mb-1 text-nowrap">Gender</span>
              <label className="font-semibold  mr-[5px]">:</label>
            </div>
            <div className="flex justify-between w-full px-5 pl-0">
              <div className="hover:scale-105 cursor-pointer">
                <InputRadio
                  formData={formData}
                  title="Male"
                  name="gender"
                  value="male"
                  handleChange={handleChange}
                />
              </div>

              <div className="hover:scale-105">
                <InputRadio
                  formData={formData}
                  title="Female"
                  name="gender"
                  value="female"
                  handleChange={handleChange}
                />
              </div>

              <div className="hover:scale-105">
                <InputRadio
                  formData={formData}
                  title="Other"
                  name="gender"
                  value="other"
                  handleChange={handleChange}
                />
              </div>
            </div>
          </div>
          <InputText
          title="Birthday"
          type='date'
          name="birthday"
          formData={formData}
          handleChange={handleChange}
          required

          />

          {/* Address Inputs */}
          <InputText
            title="Division"
            type="text"
            name="division"
            formData={formData}
            handleChange={handleChange}
            required
          />
          <InputText
            title="District"
            type="text"
            name="district"
            formData={formData}
            handleChange={handleChange}
            required
          />
          <InputText
            title="City"
            type="text"
            name="city"
            formData={formData}
            handleChange={handleChange}
            required
          />
          <InputText
            title="Area"
            type="text"
            name="area"
            formData={formData}
            handleChange={handleChange}
            required
          />
          <InputText
            title="Post Code"
            type="text"
            name="post_code"
            formData={formData}
            handleChange={handleChange}
            required
          />
          <InputText
            title="Sector"
            type="text"
            name="sector"
            formData={formData}
            handleChange={handleChange}
          />
          <InputText
            title="Road"
            type="text"
            name="road"
            formData={formData}
            handleChange={handleChange}
          />
          <InputText
            title="House"
            type="text"
            name="house"
            formData={formData}
            handleChange={handleChange}
          />

          {/* Contact Inputs */}
          <InputText
            title="Phone"
            type="number"
            name="phone"
            placeholder="01xxxxxxxxxx"
            formData={formData}
            handleChange={handleChange}
            required
          />
          <InputText
            title="Alternative"
            type="number"
            name="alt_phone"
            placeholder="01xxxxxxxxxx"
            formData={formData}
            handleChange={handleChange}
          />
          <InputText
            title="Whatsapp"
            type="number"
            name="whatsapp"
            placeholder="01xxxxxxxxxx"
            formData={formData}
            handleChange={handleChange}
          />
          <InputText
            title="Email"
            type="email"
            name="email"
            placeholder="example@gmail.com"
            formData={formData}
            handleChange={handleChange}
            required
          />

          <div className="w-full flex justify-between px-2 ">
            <div className="text-red-800/70 hover:text-red-800 hover:scale-105">
              <BackButton />
            </div>
            <button
              type="submit"
              className="bg-red-500/80 text-white px-4 py-2 rounded-xl hover:bg-red-500 ring-2 focus:ring-red-700 cursor-pointer hover:scale-105"
            >
              Add Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
