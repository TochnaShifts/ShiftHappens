"use client"

import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DarkDatePickerInput } from './DarkDatePickerInput';
import { DarkTimePickerInput } from './DarkTimePickerInput';
import { Button } from '@/app/components/loveable/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/loveable/card';
import { Badge } from '@/app/components/loveable/badge';
import { UserCategory } from '@/app/shared/types/models';
import { getAllUserCategories } from '@/app/shared/firebase/CRUD/userCategories';
import { Clock, MapPin, Users, Star, Calendar, FileText } from 'lucide-react';
import { basicInfoSchema, calculatePointsBreakdown } from './utils';

interface Props {
  defaultValues?: Partial<{
    displayName: string;
    location: string;
    startDate: string;
    startHour: string;
    duration: number;
    pointsPerHour: number;
    numUsers: number;
    details?: string;
  }>;
  onNext: (data: any) => void;
  onSave?: (data: any) => void;
}

const BasicInfoTab: React.FC<Props> = ({ defaultValues, onNext, onSave }) => {
  const [allCategories, setAllCategories] = useState<UserCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, control, formState: { errors, isValid, touchedFields } } = useForm({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      displayName: defaultValues?.displayName || '',
      location: defaultValues?.location || '',
      startDate: defaultValues?.startDate || '',
      startHour: defaultValues?.startHour || '',
      duration: defaultValues?.duration || 0,
      pointsPerHour: defaultValues?.pointsPerHour || 0,
      numUsers: defaultValues?.numUsers || 0,
      details: defaultValues?.details || '',
    },
    mode: 'onBlur',
  });

  // Watch form values for real-time calculations
  const [pointsPerHour, duration, startDate, startHour] = useWatch({
    control,
    name: ['pointsPerHour', 'duration', 'startDate', 'startHour']
  }) || [0, 0, '', ''];

  // Calculate end time
  const calculateEndTime = () => {
    if (!startHour || !duration) return '';
    try {
      const [hours, minutes] = startHour.split(':');
      const startDateObj = new Date();
      startDateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      const endDate = new Date(startDateObj.getTime() + (duration * 60 * 60 * 1000));
      
      // Handle next day if end time is after midnight
      const endHours = endDate.getHours();
      const endMinutes = endDate.getMinutes();
      
      return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    } catch (error) {
      return '';
    }
  };

  const endTime = calculateEndTime();

  // Watch all form values for auto-saving
  const watchedValues = useWatch({
    control,
    name: ['displayName', 'location', 'startDate', 'startHour', 'duration', 'pointsPerHour', 'numUsers', 'details']
  });

  // Auto-save form data when it changes (with debouncing)
  useEffect(() => {
    if (onSave && watchedValues) {
      const [displayName, location, startDate, startHour, duration, pointsPerHour, numUsers, details] = watchedValues;
      
      // Only save if at least one field has been filled
      const hasAnyValue = displayName || location || startDate || startHour || duration || pointsPerHour || numUsers || details;
      
      if (hasAnyValue) {
        const timeoutId = setTimeout(() => {
          onSave({
            displayName: displayName || '',
            location: location || '',
            startDate: startDate || '',
            startHour: startHour || '',
            duration: duration || 0,
            pointsPerHour: pointsPerHour || 0,
            numUsers: numUsers || 0,
            details: details || '',
          });
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
      }
    }
  }, [onSave, watchedValues]);

  useEffect(() => {
    setIsLoading(true);
    getAllUserCategories().then(categories => {
      setAllCategories(categories || []);
      setIsLoading(false);
    });
  }, []);

  const { total, breakdown } = calculatePointsBreakdown(pointsPerHour || 0, duration || 0, [], allCategories);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">מידע בסיסי</h2>
        <p className="text-gray-300">הזן את הפרטים הבסיסיים של המשמרת</p>
      </div>
      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5 text-blue-400" />
              פרטי המשמרת
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-400" />
                {'שם המשמרת'}
              </label>
              <input
                id="displayName"
                type="text"
                {...register('displayName')}
                className="w-full border border-white/20 rounded-md px-3 py-2 text-right bg-white/10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400"
                placeholder="הזן שם למשמרת"
              />
              {errors.displayName && touchedFields.displayName && <p className="text-red-400 text-sm">{errors.displayName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-400" />
                {'מיקום המשמרת'}
              </label>
              <input
                id="location"
                type="text"
                {...register('location')}
                className="w-full border border-white/20 rounded-md px-3 py-2 text-right bg-white/10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400"
                placeholder="הזן מיקום המשמרת"
              />
              {errors.location && touchedFields.location && <p className="text-red-400 text-sm">{errors.location.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  תאריך התחלה
                </label>
                <DarkDatePickerInput name="startDate" control={control} error={errors.startDate?.message} touched={touchedFields.startDate} />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-400" />
                  שעת התחלה
                </label>
                <DarkTimePickerInput name="startHour" control={control} error={errors.startHour?.message} touched={touchedFields.startHour} />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  משך זמן (שעות)
                </label>
                <input type="number" step="0.5" min="0.5" max="24" {...register('duration')} className="w-full border border-white/20 rounded-md px-3 py-2 text-right bg-white/10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400" />
                {errors.duration && touchedFields.duration && <p className="text-red-400 text-sm">{errors.duration.message}</p>}
              </div>
            </div>
            {endTime && (
              <div className="mt-4 p-3 bg-green-900/20 border border-green-300/30 rounded-lg">
                <div className="flex items-center justify-between text-green-200">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-400" />
                    שעת סיום משוערת:
                  </span>
                  <span className="text-lg font-bold">{endTime}</span>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-400" />
                מספר משתתפים נדרש
              </label>
              <input type="number" min="1" {...register('numUsers')} className="w-full border border-white/20 rounded-md px-3 py-2 text-right bg-white/10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400" />
              {errors.numUsers && touchedFields.numUsers && <p className="text-red-400 text-sm">{errors.numUsers.message}</p>}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Star className="h-5 w-5 text-yellow-400" />
              ניקוד
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                ניקוד בסיסי לשעה
              </label>
              <input type="number" min="0" step="0.1" {...register('pointsPerHour')} className="w-full border border-white/20 rounded-md px-3 py-2 text-right bg-white/10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400" />
              {errors.pointsPerHour && touchedFields.pointsPerHour && <p className="text-red-400 text-sm">{errors.pointsPerHour.message}</p>}
            </div>
            {total > 0 && (
              <div className="bg-blue-900/20 border border-blue-300/30 rounded-lg p-4">
                <h4 className="font-medium text-blue-200 mb-2">תצוגה מקדימה של ניקוד:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-200">סה"כ ניקוד למשמרת:</span>
                    <Badge variant="default" className="bg-blue-600 text-white">{total.toFixed(1)} נקודות</Badge>
                  </div>
                  <div className="text-sm text-blue-200">
                    <div className="font-medium mb-1">פירוט לפי קטגוריות:</div>
                    {breakdown.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-1">
                        <span>{item?.categoryName}</span>
                        <span className="text-xs opacity-80">{pointsPerHour} × {duration} × {item?.multiplier} = {item?.points.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5 text-teal-400" />
              פרטים נוספים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-teal-400" />
                פרטים נוספים (אופציונלי)
              </label>
              <textarea {...register('details')} rows={3} className="w-full border border-white/20 rounded-md px-3 py-2 text-right bg-white/10 text-white resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400" placeholder="הוסף פרטים נוספים על המשמרת..." />
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" disabled={!isValid || isLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
            {isLoading ? 'טוען...' : 'המשך לדרישות'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BasicInfoTab; 