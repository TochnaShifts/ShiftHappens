"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/loveable/card';
import { Button } from '@/app/components/loveable/button';
import { Badge } from '@/app/components/loveable/badge';
import { UserCategory } from '@/app/shared/types/models';
import { getAllUserCategories } from '@/app/shared/firebase/CRUD/userCategories';
import { ChevronRight, ChevronLeft, Users, Shield } from 'lucide-react';

interface RequirementsTabProps {
  defaultValues?: any;
  onNext: (data: any) => void;
  onBack: () => void;
  onSave?: (data: any) => void;
}

const RequirementsTab: React.FC<RequirementsTabProps> = ({
  defaultValues = {},
  onNext,
  onBack,
  onSave,
}) => {
  const [requiredCategories, setRequiredCategories] = React.useState<string[]>(
    defaultValues.requiredUserCategories || []
  );
  const [forbiddenCategories, setForbiddenCategories] = React.useState<string[]>(
    defaultValues.forbiddenUserCategories || []
  );

  // Update state when defaultValues change (when navigating back to this tab)
  React.useEffect(() => {
    setRequiredCategories(defaultValues.requiredUserCategories || []);
    setForbiddenCategories(defaultValues.forbiddenUserCategories || []);
  }, [defaultValues.requiredUserCategories, defaultValues.forbiddenUserCategories]);
  const [categories, setCategories] = React.useState<UserCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await getAllUserCategories();
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Failed to load user categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleNext = () => {
    onNext({
      requiredUserCategories: requiredCategories,
      forbiddenUserCategories: forbiddenCategories,
    });
  };

  // Auto-save when categories change
  React.useEffect(() => {
    if (onSave) {
      onSave({
        requiredUserCategories: requiredCategories,
        forbiddenUserCategories: forbiddenCategories,
      });
    }
  }, [onSave, requiredCategories, forbiddenCategories]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">דרישות המשמרת</h2>
        <p className="text-gray-300">בחר קטגוריות משתמשים נדרשות ואסורות</p>
        <p className="text-sm text-blue-300 mt-2">💡 קטגוריה לא יכולה להיות נדרשת ואסורה בו זמנית</p>
      </div>

      <Card className="bg-white/10 border-white/20">
        <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5 text-purple-400" />
              קטגוריות משתמשים
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-green-400" />
                קטגוריות נדרשות
              </label>
              <p className="text-sm text-gray-300 mb-3">
                משתמשים חייבים להיות בקטגוריות אלה כדי להירשם למשמרת
              </p>
              <div className="flex flex-wrap gap-2 p-3 border border-white/20 rounded-md bg-white/10 min-h-[60px]">
                {isLoading ? (
                  <div className="text-gray-300 text-sm">טוען קטגוריות...</div>
                ) : categories.length === 0 ? (
                  <div className="text-gray-300 text-sm">אין קטגוריות זמינות</div>
                ) : (
                  categories.map((category) => (
                                      <Badge
                    key={category.id}
                    variant={requiredCategories.includes(category.id) ? "default" : "outline"}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      requiredCategories.includes(category.id)
                        ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                        : forbiddenCategories.includes(category.id)
                        ? "bg-red-600/50 text-red-200 border-red-400 cursor-not-allowed opacity-50"
                        : "bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-blue-300"
                    }`}
                                        onClick={() => {
                    const updated = requiredCategories.includes(category.id)
                      ? requiredCategories.filter(id => id !== category.id)
                      : [...requiredCategories, category.id];
                    setRequiredCategories(updated);
                    // Remove from forbidden if it was there
                    if (forbiddenCategories.includes(category.id)) {
                      setForbiddenCategories(forbiddenCategories.filter(id => id !== category.id));
                    }
                  }}
                    >
                      {category.displayName}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-400" />
                קטגוריות אסורות
              </label>
              <p className="text-sm text-gray-300 mb-3">
                משתמשים בקטגוריות אלה לא יוכלו להירשם למשמרת
              </p>
              <div className="flex flex-wrap gap-2 p-3 border border-white/20 rounded-md bg-white/10 min-h-[60px]">
                {isLoading ? (
                  <div className="text-gray-300 text-sm">טוען קטגוריות...</div>
                ) : categories.length === 0 ? (
                  <div className="text-gray-300 text-sm">אין קטגוריות זמינות</div>
                ) : (
                  categories.map((category) => (
                                      <Badge
                    key={category.id}
                    variant={forbiddenCategories.includes(category.id) ? "default" : "outline"}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      forbiddenCategories.includes(category.id)
                        ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                        : requiredCategories.includes(category.id)
                        ? "bg-blue-600/50 text-blue-200 border-blue-400 cursor-not-allowed opacity-50"
                        : "bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-red-300"
                    }`}
                                        onClick={() => {
                    const updated = forbiddenCategories.includes(category.id)
                      ? forbiddenCategories.filter(id => id !== category.id)
                      : [...forbiddenCategories, category.id];
                    setForbiddenCategories(updated);
                    // Remove from required if it was there
                    if (requiredCategories.includes(category.id)) {
                      setRequiredCategories(requiredCategories.filter(id => id !== category.id));
                    }
                  }}
                    >
                      {category.displayName}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10 transition-all duration-200 hover:scale-105"
        >
          <ChevronLeft className="h-4 w-4 ml-2" />
          חזור למידע בסיסי
        </Button>
        
        <Button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105 shadow-lg"
        >
          המשך להקצאה
          <ChevronRight className="h-4 w-4 mr-2" />
        </Button>
      </div>
    </div>
  );
};

export default RequirementsTab; 