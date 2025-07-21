"use client"

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/loveable/tabs';
import { Clock, Users, Target, CheckCircle } from 'lucide-react';
import BasicInfoTab from './BasicInfoTab';
import RequirementsTab from './RequirementsTab';
import AssignmentTab from './AssignmentTab';
import ReviewTab from './ReviewTab';

const TAB_LIST = [
  { value: 'basic', label: 'מידע בסיסי', icon: <Clock className="h-4 w-4" /> },
  { value: 'requirements', label: 'דרישות', icon: <Users className="h-4 w-4" /> },
  { value: 'assignment', label: 'הקצאה', icon: <Target className="h-4 w-4" /> },
  { value: 'review', label: 'סיכום', icon: <CheckCircle className="h-4 w-4" /> },
];

// Form data type for the entire create shift flow
export interface CreateShiftFormData {
  // Basic Info
  displayName: string;
  location: string;
  startDate: string;
  startHour: string;
  duration: number;
  pointsPerHour: number;
  numUsers: number;
  details?: string;
  
  // Requirements
  requiredUserCategories: string[];
  forbiddenUserCategories: string[];
  
  // Assignment
  assignmentType: 'manual' | 'automatic';
  selectedUsers?: string[];
  autoUserCount?: number;
}

const CreateShiftTabs: React.FC = () => {
  const params = useParams();
  const groupId = params.groupId as string;
  
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<Partial<CreateShiftFormData>>({});
  const [assignedUsers, setAssignedUsers] = useState<any[]>([]);
  
  // Refs to store current form data from each tab
  const basicInfoRef = React.useRef<any>(null);
  const requirementsRef = React.useRef<any>(null);
  const assignmentRef = React.useRef<any>(null);

  // Save handlers for each tab
  const handleBasicInfoSave = (data: any) => {
    basicInfoRef.current = data;
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleRequirementsSave = (data: any) => {
    requirementsRef.current = data;
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleAssignmentSave = (data: any) => {
    assignmentRef.current = data;
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleBasicInfoNext = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setActiveTab('requirements');
  };

  const handleRequirementsNext = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setActiveTab('assignment');
  };

  const handleRequirementsBack = () => {
    setActiveTab('basic');
  };

  const handleAssignmentNext = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    // If automatic assignment, get the assigned users
    if (data.assignmentType === 'automatic') {
      // This would be populated from the automatic assignment algorithm
      setAssignedUsers([]); // Placeholder
    }
    setActiveTab('review');
  };

  const handleAssignmentBack = () => {
    setActiveTab('requirements');
  };

  const handleReviewBack = () => {
    setActiveTab('assignment');
  };

  // Handle tab change with automatic saving
  const handleTabChange = (newTab: string) => {
    // Save current tab data before switching
    if (activeTab === 'basic' && basicInfoRef.current) {
      setFormData(prev => ({ ...prev, ...basicInfoRef.current }));
    } else if (activeTab === 'requirements' && requirementsRef.current) {
      setFormData(prev => ({ ...prev, ...requirementsRef.current }));
    } else if (activeTab === 'assignment' && assignmentRef.current) {
      setFormData(prev => ({ ...prev, ...assignmentRef.current }));
    }
    
    setActiveTab(newTab);
  };

  const handleSubmit = async () => {
    try {
      // TODO: Submit the complete form data to create the shift
      console.log('Submitting shift:', formData);
      
      // Show success message
      alert('המשמרת נוצרה בהצלחה!');
      
      // Redirect to group dashboard or shifts list
      // router.push(`/group-admin/${groupId}/dashboard`);
    } catch (error) {
      console.error('Failed to create shift:', error);
      alert('שגיאה ביצירת המשמרת');
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full" dir="rtl">
      <TabsList className="grid w-full grid-cols-4 bg-white/10">
        {TAB_LIST.map(tab => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="text-white data-[state=active]:bg-white data-[state=active]:text-gray-900 flex items-center gap-2"
          >
            {tab.icon}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
            <TabsContent value="basic" className="mt-6">
        <BasicInfoTab 
          defaultValues={formData} 
          onNext={handleBasicInfoNext}
          onSave={handleBasicInfoSave}
        />
      </TabsContent>
      
      <TabsContent value="requirements" className="mt-6">
        <RequirementsTab
          defaultValues={formData}
          onNext={handleRequirementsNext}
          onBack={handleRequirementsBack}
          onSave={handleRequirementsSave}
        />
      </TabsContent>
      
      <TabsContent value="assignment" className="mt-6">
        <AssignmentTab
          defaultValues={formData}
          onNext={handleAssignmentNext}
          onBack={handleAssignmentBack}
          onSave={handleAssignmentSave}
          shiftData={{
            numUsers: formData.numUsers || 0,
            requiredUserCategories: formData.requiredUserCategories || [],
            forbiddenUserCategories: formData.forbiddenUserCategories || [],
            startDate: formData.startDate || '',
            startHour: formData.startHour || '',
            duration: formData.duration || 0,
          }}
          groupId={groupId}
        />
      </TabsContent>
      
      <TabsContent value="review" className="mt-6">
        <ReviewTab
          onBack={handleReviewBack}
          onSubmit={handleSubmit}
          formData={formData as CreateShiftFormData}
          groupId={groupId}
          assignedUsers={assignedUsers}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CreateShiftTabs; 