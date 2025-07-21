import React from 'react';
import { Card, CardContent } from '@/app/components/loveable/card';
import CreateShiftTabs from './Tabs';

const CreateShiftPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <CreateShiftTabs />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateShiftPage; 