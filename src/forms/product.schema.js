import z from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required!'),
  brand_id: z.string().min(1, 'Brand is required!'),
  category_id: z.string().min(1, 'Category is required!'),
  sku: z.string().min(1, 'An unique sku required!'),
  price: z
    .string()
    .min(1, 'Price is required!')
    .refine((val) => !isNaN(Number(val.trim())), {
      message: 'Price must be a number',
    })
    .refine((val) => Number(val) >= 0, {
      message: 'Price must be positive',
    }),
  image: z
    .any()
    .refine((file) => file instanceof File, {
      message: 'Image is required!',
    })
    .refine(
      (file) => ['image/jpeg','image/jpg', 'image/png', 'image/webp'].includes(file?.type),
      {
        message: 'Only JPG, PNG, WEBP files are allowed',
      }
    )
    .refine((file) => file?.size <= 2 * 1024 * 1024, {
      message: 'Image size must be less than 2MB',
    }),
  description: z.string().optional().or(z.literal('')),
});
