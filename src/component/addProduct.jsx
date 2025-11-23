import { Plus } from 'lucide-react';
import BackButton from '../ui/backButton';
import InputText from '../ui/inputText';
import { useEffect, useState } from 'react';
import Select from '../ui/select';
import API from '../api/api';
import ImageUploader from '../ui/imageUploader';

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormdata] = useState({
    name: '',
    brand_id: '',
    category_id: '',
    sku: '',
    price: '',
    stock: '',
    description: '',
  });

  
  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, brandRes] = await Promise.all([
          API.get('/categories'),
          API.get('/brands'),
        ]);
        setCategories(catRes.data);
        setBrands(brandRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    fetchData();
  }, []);

  
  const handleChange = (e) => {
    setFormdata({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.sku || !formData.price) {
      alert('Name, SKU, and Price are required!');
      return;
    }

    const data = new FormData();
    for (let key in formData) data.append(key, formData[key]);
    if (imageFile) data.append('image', imageFile);

    try {
      await API.post(`/products`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Product added successfully!');
      setFormdata({
        name: '',
        brand_id: '',
        category_id: '',
        sku: '',
        price: '',
        stock: '',
        description: '',
      });
      setImageFile(null);
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Failed to add product');
    }
  };

  return (
    <div className="bg-gray-100 w-full min-h-screen flex justify-center items-center text-[#030006]">
      <div className="flex flex-col gap-5 sm:gap-15 bg-[#e0ccf8] m-3 p-5 shadow-xl ring-0 rounded-lg w-full max-w-[1000px] mt-5 border-2 border-gray-300">
        <div className="flex flex-col gap-2">
          <span className="text-[24px] sm:text-[28px] font-serif font-semibold flex justify-center">
            Add New Product
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-10">
          <InputText
            title="Name"
            type="text"
            name="name"
            placeholder="Enter product name..."
            formData={formData}
            handleChange={handleChange}
            required
          />

          <Select
            label="Brand"
            required
            options={brands.map((b) => ({ value: b.id, label: b.name }))}
            value={formData.brand_id}
            onChange={(v) => setFormdata({ ...formData, brand_id: v })}
            placeholder="Select Brand"
          />

          <Select
            label="Category"
            required
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            value={formData.category_id}
            onChange={(v) => setFormdata({ ...formData, category_id: v })}
            placeholder="Select Category"
          />

          <InputText
            title="SKU"
            type="text"
            name="sku"
            placeholder="Enter unique SKU..."
            formData={formData}
            handleChange={handleChange}
            required
          />

          <InputText
            title="Price"
            type="number"
            name="price"
            placeholder="Enter price..."
            formData={formData}
            handleChange={handleChange}
            required
          />

          <InputText
            title="Stock"
            type="number"
            name="stock"
            placeholder="Enter stock..."
            formData={formData}
            handleChange={handleChange}
            required
          />

          <InputText
            title="Description"
            type="text"
            name="description"
            placeholder="Enter description..."
            formData={formData}
            handleChange={handleChange}
          />

          <ImageUploader onFileSelect={setImageFile} required />

          <div className="flex justify-between">
            <BackButton />
            <button
              type="submit"
              className="ring-0 rounded-lg bg-red-600/85 hover:bg-red-600 flex items-center p-1 gap-1 cursor-pointer"
            >
              <Plus className="h-4 w-4 text-white" />
              <span className="text-white">Add Product</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
