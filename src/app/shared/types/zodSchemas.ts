import * as z from 'zod';
import { Gender, RequestType } from './enums';

export const userRegisterSchema = z.object({
  username: z.string().min(1, 'נדרש שם משתמש'),
  password: z.string().min(6, 'סיסמה חייבת להכיל לפחות 6 תווים'),
  confirmPassword: z.string().min(6, 'סיסמה חייבת להכיל לפחות 6 תווים'),
  fullName: z.string().min(1, 'נדרש שם מלא'),
  gender: z.nativeEnum(Gender, { message: 'נדרש מגדר' }),
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


export const requestFormSchema = z.object({
  type: z.string().optional(),
  startDate: z.string().min(1, "תאריך התחלה נדרש"),
  endDate: z.string().min(1, "תאריך סיום נדרש"),
  description: z.string().optional(),
}).refine(
  (data) => data.type && [RequestType.Exclude, RequestType.Prefer].includes(Number(data.type)),
  { message: "סוג הבקשה נדרש", path: ["type"] }
)
.refine(
  (data) => {
    if (!data.startDate || !data.endDate) return true;
    return new Date(data.startDate) <= new Date(data.endDate);
  },
  {
    message: "תאריך התחלה לא יכול להיות מאוחר מתאריך סיום",
    path: ["endDate"],
  }
);

export type RequestFormZod = z.infer<typeof requestFormSchema>;