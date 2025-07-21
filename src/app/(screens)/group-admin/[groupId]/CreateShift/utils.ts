import { z } from 'zod';
import { UserCategory, User, Shift, UserGroupPoints } from '@/app/shared/types/models';
import { getUserGroupPointsByUserAndGroup } from '@/app/shared/firebase/CRUD/userGroupPoints';
import { getShiftsByGroupId } from '@/app/shared/firebase/CRUD/shifts';
import { ShiftStatus } from '@/app/shared/types/enums';

// Zod Schemas
export const basicInfoSchema = z.object({
  displayName: z.string().min(2, 'יש להזין שם משמרת'),
  location: z.string().min(2, 'יש להזין מיקום'),
  startDate: z.string().min(1, 'יש לבחור תאריך התחלה'),
  startHour: z.string().min(1, 'יש לבחור שעת התחלה'),
  duration: z.coerce.number().min(0.5, 'יש להזין משך זמן').max(24, 'משך זמן מקסימלי הוא 24 שעות'),
  pointsPerHour: z.coerce.number().min(0, 'יש להזין ניקוד לשעה'),
  numUsers: z.coerce.number().min(1, 'יש לבחור מספר משתתפים'),
  details: z.string().optional(),
});

export const requirementsSchema = z.object({
  maxAge: z.coerce.number().min(18, 'גיל מינימלי הוא 18').max(100, 'גיל מקסימלי הוא 100').optional(),
  minAge: z.coerce.number().min(18, 'גיל מינימלי הוא 18').max(100, 'גיל מקסימלי הוא 100').optional(),
  gender: z.enum(['male', 'female', 'any']).optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced', 'any']).optional(),
  specialEquipment: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const assignmentSchema = z.object({
  assignmentType: z.enum(['manual', 'automatic']),
  selectedUsers: z.array(z.string()).optional(),
  autoUserCount: z.coerce.number().min(1, 'יש לבחור מספר משתמשים').optional(),
});

// Points calculation
export function calculatePointsBreakdown(pointsPerHour: number, duration: number, requiredUserCategories: string[], allCategories: UserCategory[]) {
  if (!pointsPerHour || !duration || !requiredUserCategories?.length) {
    return { total: 0, breakdown: [] };
  }
  const breakdown = requiredUserCategories.map(categoryId => {
    const category = allCategories.find(c => c.id === categoryId);
    if (!category) return null;
    const pointsForCategory = pointsPerHour * duration * category.pointsMultiplier;
    return {
      categoryName: category.displayName,
      multiplier: category.pointsMultiplier,
      points: pointsForCategory
    };
  }).filter(Boolean);
  const total = breakdown.reduce((sum, item) => sum + (item?.points || 0), 0);
  return { total, breakdown };
}

// End date calculation
export function calculateEndDate(startDate: string, startHour: string, duration: number): Date {
  const startDateTime = new Date(startDate + ' ' + startHour);
  return new Date(startDateTime.getTime() + duration * 60 * 60 * 1000);
}

// Week logic (Sunday-Saturday)
export function isInSameWeek(date1: Date, date2: Date): boolean {
  // Set to Sunday
  const startOfWeek = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
  };
  return startOfWeek(date1).getTime() === startOfWeek(date2).getTime();
}

// Calculate weekly hours for a user in a group for a given week
export async function calculateWeeklyHours(userId: string, groupId: string, weekDate: Date): Promise<number> {
  const shifts = await getShiftsByGroupId(groupId);
  return shifts.filter(shift =>
    shift.users.includes(userId) &&
    (shift.status === ShiftStatus.Active || shift.status === ShiftStatus.Finished) &&
    isInSameWeek(new Date(shift.startDate), weekDate)
  ).reduce((total, shift) => {
    const start = new Date(shift.startDate);
    const end = new Date(shift.endDate);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return total + duration;
  }, 0);
}

// Calculate current points for a user in a group
export async function calculateCurrentPoints(userId: string, groupId: string): Promise<number> {
  const pointsDoc = await getUserGroupPointsByUserAndGroup(userId, groupId);
  return pointsDoc?.count || 0;
}

// User fitness logic (to be expanded as needed)
export interface UserFitness {
  user: User;
  isFit: boolean;
  reasons: string[];
  weeklyHours: number;
  currentPoints: number;
  categoryMultiplier?: number;
} 