import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import BackButton from '../../../ui/backButton';
import InputText from '../../../ui/inputText';
import InputTextarea from '../../../ui/customTextArea';
import ImageUploader from '../../../ui/imageUploader';
import CustomSelect from '../../../ui/customSelect';
import API from '../../../api/api';
import useToast from '../../../toast/useToast';
import { productUpdateSchema } from '../../../forms/product.schema';
import { useEnterNavigation } from '../../../forms/utils/useEnterNavigation';
import { focusFirstError } from '../../../forms/utils/focusFirstError';
import { set } from 'zod';

export default function EditProduct() {
  const { setProducts } = useOutletContext();
  const { id } = useParams();
  const productId = parseInt(id, 10);
  const navigate = useNavigate();
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
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
    resolver: zodResolver(productUpdateSchema),
    defaultValues: {
      brand_id: '',
      category_id: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
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

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await API.get(`/products/${productId}`);
        const product = res.data?.data || res.data;

        const normalized = {
          ...product,
          price:
            product?.price === undefined || product?.price === null
              ? ''
              : String(product.price),
          brand_id:
            product?.brand_id === undefined || product?.brand_id === null
              ? ''
              : String(product.brand_id),
          category_id:
            product?.category_id === undefined || product?.category_id === null
              ? ''
              : String(product.category_id),
          description: product?.description || '',
        };

        reset(normalized);
        if (product?.image_url) {
          setExistingImage(product.image_url);
          setImagePreview(product.image_url);
        }
      } catch (err) {
        console.error(err.message);
        if (err.response?.status === 404) {
          toast.error('Product not found');
          navigate(-1);
        }
      }
    }

    if (!Number.isNaN(productId)) {
      fetchProduct();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const onSubmit = async (data) => {
    if (!isDirty) {
      toast.info('No changes detected');
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'image') return;
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
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

    try {
      const res = await API.put(`/products/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(res.data?.message || 'Product updated successfully!');
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, price: data.price } : p))
      );

      navigate('/product');
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error('Failed to update product!');
    }
  };

  const enterNavigation = useEnterNavigation({
    errors,
    submit: handleSubmit(onSubmit),
  });

  const onError = (formErrors) => {
    focusFirstError(formErrors);
  };

  return (
    <div className="bg-gray-100 w-full min-h-screen flex justify-center items-center text-[#030006]">
      <div className="flex flex-col gap-5 sm:gap-15 bg-[#ffffff] m-3 p-5 shadow-xl ring-0 rounded-lg w-full max-w-[1000px] mt-5 border-2 border-gray-200">
        <div className="flex flex-col gap-2">
          <span className="text-[24px] sm:text-[28px] font-serif font-semibold flex justify-center">
            Edit Product
          </span>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          onKeyDown={enterNavigation}
          className="flex flex-col gap-5 sm:gap-10 w-full"
        >
          <div className="w-full flex justify-between">
            <div className="w-[45%]">
              <InputText
                label="Name"
                name="name"
                register={register}
                placeholder="Enter product name..."
                error={errors.name?.message}
                required
              />

              <InputText
                label="SKU"
                name="sku"
                register={register}
                placeholder="Enter unique SKU..."
                error={errors.sku?.message}
                required
              />
            </div>
            <div className="w-[45%]">
              <InputText
                label="Price"
                name="price"
                register={register}
                placeholder="Enter price..."
                error={errors.price?.message}
                required
              />

              <InputTextarea
                label="Description"
                name="description"
                rows={3}
                maxLength={500}
                register={register}
                placeholder="Type description text..."
                error={errors.description?.message}
              />
            </div>
          </div>

          <div className="flex justify-between items-center w-full">
            <div className="w-[70%]">
              <CustomSelect
                label="Brand"
                name="brand_id"
                placeholder="Select Brand"
                options={brands.map((b) => ({
                  value: `${b.id}`,
                  label: b.name,
                }))}
                value={watch('brand_id')}
                onChange={(val) =>
                  setValue('brand_id', val, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                error={errors.brand_id?.message}
                required
              />
            </div>
            <span className="mt-5">OR</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                setTimeout(() => {
                  navigate('/brand/add');
                }, 350);
              }}
              className="flex items-center gap-1 w-fit p-2 px-3 border border-gray-300 rounded-lg focus:border-3 focus:border-blue-400 
              shadow text-white bg-blue-500 hover:bg-blue-600 self-center mt-5 cursor-pointer"
            >
              <PlusIcon size={16} />
              Add Brand
            </button>
          </div>

          <div className="flex justify-between items-center w-full">
            <div className="w-[70%]">
              <CustomSelect
                label="Category"
                name="category_id"
                placeholder="Select Category"
                options={categories.map((c) => ({
                  value: `${c.id}`,
                  label: c.name,
                }))}
                value={watch('category_id')}
                onChange={(val) =>
                  setValue('category_id', val, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                error={errors.category_id?.message}
                required
              />
            </div>
            <span className="mt-5">OR</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                setTimeout(() => {
                  navigate('/category/add');
                }, 500);
              }}
              className="flex items-center gap-1 w-fit p-2 px-3 focus:border-3 focus:border-blue-400 
              border border-gray-400 rounded-lg shadow bg-blue-500 hover:bg-blue-600 hover:bg-gradient-to-b
              text-white self-center mt-5 cursor-pointer"
            >
              <PlusIcon size={16} />
              Add Category
            </button>
          </div>

          <ImageUploader
            label="Product Image"
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

          <div className="flex justify-between">
            <BackButton />
            <button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="flex items-center gap-2 text-white px-6 py-2 rounded-lg active:scale-95
                        disabled:opacity-60 cursor-pointer focus:border-3 focus:border-blue-400 bg-blue-500 hover:bg-blue-600
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
