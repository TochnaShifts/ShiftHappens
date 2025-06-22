import * as z from 'zod';
import { Gender } from './enums';

export const userRegisterSchema = z.object({
  username: z.string().min(1, 'נדרש שם משתמש'),
  password: z.string().min(6, 'סיסמה חייבת להכיל לפחות 6 תווים'),
  confirmPassword: z.string().min(6, 'סיסמה חייבת להכיל לפחות 6 תווים'),
  fullName: z.string().min(1, 'נדרש שם מלא'),
  gender: z.nativeEnum(Gender),
  selectedGroups: z.array(z.string()).min(1, 'בחר לפחות קבוצה אחת'),
  userCategories: z.array(z.string()).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'הסיסמאות לא תואמות',
  path: ['confirmPassword'],
});

export type UserRegisterZod = z.infer<typeof userRegisterSchema>; 

export const userLoginSchema = z.object({
    username: z.string().min(1, 'נדרש שם משתמש'),
    password: z.string().min(6, 'סיסמה חייבת להכיל לפחות 6 תווים'),
});

export type UserLoginZod = z.infer<typeof userLoginSchema>;