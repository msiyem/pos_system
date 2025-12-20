import { useEffect, useState } from 'react';
import InputText from '../../ui/inputText';
import InputRadio from '../../ui/radio';
import BackButton from '../../ui/backButton';
import { useNavigate, useParams } from 'react-router';

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customerId = parseInt(id);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
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
    status: '',
    verify:'',
  });
  useEffect(() => {
    async function fetchCustomer() {
      try {
        const res = await fetch(
          `http://localhost:3000/customers/${customerId}/details`
        );
        const data = await res.json();
        if (res.ok && data) {
          setFormData({
            name: data.name,
            gender: data.gender,
            division: data.division,
            district: data.district,
            city: data.city,
            area: data.area,
            post_code: data.post_code,
            sector: data.sector,
            road: data.road,
            house: data.house,
            phone: data.phone,
            alt_phone: data.alt_phone,
            whatsapp: data.whatsapp,
            email: data.email,
            status: data.status,
            verify: data.verify,
          });
        } else {
          alert('❌ Customer not found!');
        }
      } catch (err) {
        console.log(err);
        alert('❌ Error fetching customer details');
      }
    }
    fetchCustomer();
  }, [customerId]);

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
      alert('❌Error! Please select a gender!');
      return;
    }

    // Phone validation
    if (formData.phone.length !== 11) {
      alert('❌Error! Phone number must be exactly 11 digits!');
      return;
    }

    //Alternative phone validation
    if (formData.alt_phone && formData.alt_phone.length !== 11) {
      alert('❌Error! Alternative phone must be exactly 11 digits!');
      return;
    }

    //Whatsapp number validation
    if (formData.whatsapp && formData.whatsapp.length !== 11) {
      alert('❌Error! Whatsapp number must be exactly 11 digits!');
      return;
    }

    // Prepare payload for backend
    const payload = {
      name: formData.name,
      gender: formData.gender,
      status: formData.status,
      address: {
        division: formData.division,
        district: formData.district,
        city: formData.city,
        area: formData.area,
        post_code: formData.post_code,
        sector: formData.sector,
        road: formData.road,
        house: formData.house,
      },
      contact: {
        phone: formData.phone,
        alt_phone: formData.alt_phone,
        whatsapp: formData.whatsapp,
        email: formData.email,
        verify: formData.verify==='1'?1: 0,
      },
    };

    try {
      const res = await fetch(`http://localhost:3000/api/customers/${customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('❌Failed to Update customer!');
      const data = await res.json();

      alert('✅Customer Updated Successfully!');
      navigate(-1);

      // Reset form
      setFormData({
        name: data.name,
        gender: data.gender,
        division: data.division,
        district: data.district,
        city: data.city,
        area: data.area,
        post_code: data.post_code,
        sector: data.sector,
        road: data.road,
        house: data.house,
        phone: data.phone,
        alt_phone: data.alt_phone,
        whatsapp: data.whatsapp,
        email: data.email,
        status: data.status,
        verify: data.verify,
      });
    } catch (err) {
      console.error(err);
      alert('❌Error adding customer');
    }
  };

  return (
    <div className="bg-gray-100 overflow-y-auto w-full min-h-screen flex justify-center text-[#020003]">
      <div className="bg-[#f3eafe] m-5 mb-10 p-5 w-full max-w-[1000px] rounded-xl shadow">
        <div className="text-[28px] mb-10 font-semibold font-serif flex justify-center">
          Edit Customer
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
              <span className="font-semibold mb-1 text-nowrap">
                Gender
              </span>
              <label className="font-semibold  mr-[5px]">:</label>
            </div>
            <div className="flex justify-between w-full px-5 pl-0">
              <div className='hover:scale-105'>
                <InputRadio
                formData={formData}
                title="Male"
                name="gender"
                value="male"
                handleChange={handleChange}
              />
              </div>
              
              <div className='hover:scale-105'>
                <InputRadio
                formData={formData}
                title="Female"
                name="gender"
                value="female"
                handleChange={handleChange}
              />
              </div>
              
              <div className='hover:scale-105'>
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
          {/* Status Radio  */}
          <div className="flex gap-2 items-center w-full">
            <div className="w-[18ch] flex justify-between">
              <span className="font-semibold  mb-1 text-nowrap">
                Status
              </span>
              <label className="font-semibold  mr-[5px]">:</label>
            </div>
            <div className="flex justify-between w-full px-5 pl-0">
              <InputRadio
                formData={formData}
                title="Active"
                name="status"
                value="active"
                handleChange={handleChange}
              />
              <InputRadio
                formData={formData}
                title="Inactive"
                name="status"
                value="inactive"
                handleChange={handleChange}
              />
              <InputRadio
                formData={formData}
                title="Banned"
                name="status"
                value="banned"
                handleChange={handleChange}
              />
            </div>
          </div>

          {/* Verify Radio */}
          <div className="flex gap-2 items-center w-full">
            <div className="w-[18ch] flex justify-between">
              <span className="font-semibold  mb-1 text-nowrap">
                Verified
              </span>
              <label className="font-semibold  mr-[5px]">:</label>
            </div>
            <div className="flex justify-between w-full px-5 pl-0">
              <InputRadio
                formData={formData}
                title="Yes"
                name="verify"
                value="1"
                handleChange={handleChange}
              />
              <InputRadio
                formData={formData}
                title="No"
                name="verify"
                value="0"
                handleChange={handleChange}
              />
            </div>
          </div>

          <div className="w-full flex justify-between px-2">
            <div className="text-[#2e1747]/80 hover:text-[#2e1747] hover:scale-105 in-focus:shadow-[#2e1747]">
              <BackButton />
            </div>
            <button
              type="submit"
              className="bg-[#623e8a]/80 text-white px-4 py-2 rounded-xl hover:bg-[#623e8a] hover:scale-104 cursor-pointer"
            >
              Update Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
