import {z} from 'zod';

export const supplierSchema = z.object({
  name: z.string().min(1,'Name is required!'),
  gender: z.enum(['male','female','other'],{
    error:()=>({message: 'please select gender'}),
  }),
  birthday: z.string().min(1,'Birthday is required!'),
  phone: z
  .string()
  .min(1,'Phone is required!')
  .regex(/^[0-9]{11}$/,'Phone must be exactly 11 digits numbers !'),
  alt_phone: z.string()
  .regex(/^[0-9]{11}$/,'Alternative phone must be 11 digits numbers !')
  .optional()
  .or(z.literal('')),
  whatsapp: z
  .string()
  .regex(/^[0-9]{11}$/, 'Whatsapp must be 11 digits!')
  .optional()
  .or(z.literal('')),
  email: z.email('Invalid email address!'),
  division: z.string().min(1,'Division is required!'),
  district: z.string().min(1,"District is required!"),
  city: z.string().optional(),
  area: z.string().optional(),
  post_code: z.string().min(1, 'Post code is required'),
  sector: z.string().optional(),
  road: z.string().optional(),
  house: z.string().optional(),

});