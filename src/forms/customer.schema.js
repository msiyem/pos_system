import z from 'zod';

export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required!'),
  gender: z.enum(['male', 'female', 'other'], {
    error: () => ({ message: 'please select gender!' }),
  }),
  birthday: z.string().min(1, 'Birthday is required!').optional(),
  division: z.string().min(1, 'Division is required!'),
  district: z.string().min(1, 'District is required!'),

  post_code: z.string().min(4, 'Post code must be 4 characters').max(4, 'Post code must be at most 4 characters').optional(),
  city: z.string().optional().nullable().or(z.literal('')),
  area: z.string().optional().nullable().or(z.literal('')),
  sector: z.string().optional().nullable().or(z.literal('')),
  road: z.string().optional().nullable().or(z.literal('')),
  house: z.string().optional().nullable().or(z.literal('')),

  phone: z
    .string()
    .min(1, 'Phone is required!')
    .regex(/^[0-9]{11}$/, 'Phone must be exactly 11 digits numbers !'),
  alt_phone: z
    .string()

    .regex(/^[0-9]{11}$/, 'Alternative phone must be 11 digits numbers !')
    .optional()
    .nullable()
    .or(z.literal('')),
  whatsapp: z
    .string()
    .regex(/^[0-9]{11}$/, 'Whatsapp must be 11 digits!')
    .optional()
    .nullable()
    .or(z.literal('')),
  email: z.email('Invalid email address!'),
  image: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File, {
      message: 'Invalid image file',
    })
    .refine(
      (file) =>
        !file ||
        ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
          file?.type
        ),
      {
        message: 'Only JPG, PNG, WEBP file are allowed',
      }
    )
    .refine((file) => !file || file?.size <= 2 * 1024 * 1024, {
      message: 'Image size must be less than 2MB',
    }),
  notes: z.string().optional().or(z.literal('')).nullable(),
});
