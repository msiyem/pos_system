import { z } from 'zod';

const name = z
  .string()
  .min(1, 'Name is required!')
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name too long');

const email = z
  .string()
  .min(1, 'Email is required!')
  .email('Invalid email address');

const phone = z
  .string()
  .min(1, 'Phone number is required!')
  .regex(/^01\d{9}$/, 'Invalid Bangladeshi phone number');

const optionalPhone = z
  .string()
  .regex(/^01\d{9}$/, 'Invalid phone number')
  .optional()
  .or(z.literal(''));

const role = z.enum(['admin', 'staff'], {
  errorMap: () => ({ message: 'Role is required' }),
});

const gender = z.enum(['male', 'female', 'other'], {
  errorMap: () => ({ message: 'Gender is required' }),
});

const password = z
  .string()
  .min(1, 'Password is required!')
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'At least one uppercase letter')
  .regex(/[0-9]/, 'At least one number');


export const userSchema = z
  .object({
    name,
    email,
    phone,
    alt_phone: optionalPhone,
    whatsapp: optionalPhone,

    password,
    confirmpassword: z.string().min(1, 'Confirm password is required'),

    role,
    gender,

    birthday: z.string().min(1, 'Birthday is required'),

    division: z.string().min(1, 'Division is required'),
    district: z.string().min(1, 'District is required'),
    city: z.string().optional().or(z.literal('')),
    area: z.string().optional().or(z.literal('')),
    post_code: z
      .string()
      .min(4, 'Post code must be 4 digits')
      .max(4, 'Post code must be 4 digits')
      .optional(),
    road: z.string().optional().or(z.literal('')),
    house: z.string().optional().or(z.literal('')),
    image: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: 'Passwords do not match',
    path: ['confirmpassword'],
  });

export const userUpdateSchema = z.object({
  name,
  phone,
  alt_phone: optionalPhone,
  whatsapp: optionalPhone,
  role,
  gender,
  birthday: z.string().optional(),
  division: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  area: z.string().optional(),
  post_code: z.string().optional(),
  road: z.string().optional(),
  house: z.string().optional(),
  image: z.any().optional(),
});

/* -------------------------
   CHANGE PASSWORD
------------------------- */
export const changePasswordSchema = z
  .object({
    current_password: z.string().min(6, 'Current password is required'),
    new_password: password,
    confirm_password: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });
