
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from '@/app/hooks/use-toast';

export interface ShiftFormData {
  title: string;
  date: string;
  startTime: string;
  duration: number;
  type: string;
  pointsPerHour: number;
  requiredParticipants: number;
  requiredCategories: string[];
  excludedCategories: string[];
  assignmentType: string;
  selectedUsers: number[];
  description: string;
}

export const useCreateShiftForm = () => {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get('groupId');
  
  const [activeTab, setActiveTab] = useState("basic");
  const [shiftData, setShiftData] = useState<ShiftFormData>({
    title: '',
    date: '',
    startTime: '08:00',
    duration: 4,
    type: 'regular',
    pointsPerHour: 10,
    requiredParticipants: 1,
    requiredCategories: [],
    excludedCategories: [],
    assignmentType: 'auto',
    selectedUsers: [],
    description: ''
  });

  const calculateEndTime = () => {
    if (!shiftData.startTime || !shiftData.duration) return '';
    const [hours, minutes] = shiftData.startTime.split(':');
    const startDate = new Date();
    startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    const endDate = new Date(startDate.getTime() + (shiftData.duration * 60 * 60 * 1000));
    return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleCreateShift = () => {
    toast({
      title: "המשמרת נוצרה בהצלחה",
      description: "המשמרת נשמרה ונשלחה למשתתפים המוקצים",
    });
    navigate(`/admin/group/${groupId}/shifts`, {
      groupId: groupId
    });
  };

  const handleSaveTemplate = () => {
    toast({
      title: "התבנית נשמרה",
      description: "ניתן להשתמש בתבנית זו ליצירת משמרות עתידיות",
    });
  };

  const isFormValid = (): boolean => {
    return !!(shiftData.title && shiftData.date && shiftData.startTime && shiftData.duration);
  };

  return {
    activeTab,
    setActiveTab,
    shiftData,
    setShiftData,
    calculateEndTime,
    handleCreateShift,
    handleSaveTemplate,
    isFormValid,
    groupId
  };
};
