"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/app/components/loveable/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/loveable/card";
import { Button } from "@/app/components/loveable/button";
import { Badge } from "@/app/components/loveable/badge";
import { Checkbox } from "@/app/components/loveable/checkbox";
import { Shield, ShieldOff, Trash2, Clock, Star, Crown, AlertCircle, X, Save, Edit3, Award } from "lucide-react";
import { useGetUserCategories, useGetUserShiftHistory, useGetUserUpcomingShifts, useGetUserShiftsThisMonth, useGetUserTotalShifts, useUpdateUserRole, useUpdateUserCategories, useGetUserGroupPoints } from "../hooks/userManagementHooks";
import { User, UserCategory } from "@/app/shared/types";

interface UserDetailSheetProps {
  groupId: string;
  selectedUser: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserDetailSheet = ({ groupId, selectedUser, isOpen, onClose }: UserDetailSheetProps) => {
  const { data: categories } = useGetUserCategories();
  const { data: shiftHistory } = useGetUserShiftHistory(selectedUser?.id || '', groupId);
  const { data: upcomingShifts } = useGetUserUpcomingShifts(selectedUser?.id || '', groupId);
  const { data: shiftsThisMonth } = useGetUserShiftsThisMonth(selectedUser?.id || '', groupId);
  const { data: totalShifts } = useGetUserTotalShifts(selectedUser?.id || '', groupId);
  const { data: userPoints } = useGetUserGroupPoints(groupId, selectedUser?.id || '');
  
  const updateUserRole = useUpdateUserRole(groupId);
  const updateUserCategories = useUpdateUserCategories(groupId);
  
  const [editingCategories, setEditingCategories] = useState(false);
  const [tempUserCategories, setTempUserCategories] = useState<string[]>([]);
  const [localUser, setLocalUser] = useState<User | null>(null);

  // Update local user when selectedUser changes
  useEffect(() => {
    setLocalUser(selectedUser);
    if (selectedUser) {
      setTempUserCategories(selectedUser.userCategories);
    }
  }, [selectedUser]);

  const isGroupAdmin = localUser?.groups?.some(g => g.groupId === groupId && g.isAdmin);

  const handleToggleAdmin = () => {
    if (!localUser) return;
    const action = isGroupAdmin ? 'removeAdmin' : 'makeAdmin';
    updateUserRole.mutate({ userId: localUser.id, action });
  };

  const handleRemoveUser = () => {
    if (!localUser) return;
    updateUserRole.mutate({ userId: localUser.id, action: 'removeFromGroup' });
    onClose();
  };

  const handleSaveCategories = async () => {
    if (!localUser) return;
    try {
      await updateUserCategories.mutateAsync({ 
        userId: localUser.id, 
        userCategories: tempUserCategories 
      });
      
      // Update local user immediately
      setLocalUser({
        ...localUser,
        userCategories: tempUserCategories
      });
      
      setEditingCategories(false);
    } catch (error) {
      console.error('Failed to update user categories:', error);
    }
  };

  const handleToggleCategory = (categoryId: string) => {
    if (tempUserCategories.includes(categoryId)) {
      setTempUserCategories(tempUserCategories.filter(id => id !== categoryId));
    } else {
      setTempUserCategories([...tempUserCategories, categoryId]);
    }
  };

  const getUserCategories = (user: User) => {
    if (!categories) return [];
    return categories.filter(cat => user.userCategories.includes(cat.id));
  };

  const getStatusBadge = (user: User) => {
    if (!user.isActive) {
      return (
        <Badge variant="destructive" className="text-xs px-2 py-1 bg-red-500/20 text-red-400 border-red-500/30">
          לא פעיל
        </Badge>
      );
    }
    
    if (isGroupAdmin) {
      return (
        <Badge className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 border-orange-500/30">
          מנהל קבוצה
        </Badge>
      );
    }

    return (
      <Badge className="text-xs px-2 py-1 bg-green-500/20 text-green-400 border-green-500/30">
        פעיל
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="bg-gray-800/95 backdrop-blur-sm w-full sm:w-[600px] max-w-[100vw] overflow-hidden border-0" side="left">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white text-right" dir="rtl">
              פרטי משתמש
            </SheetTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-700/50">
              <X className="w-4 h-4 text-white" />
            </Button>
          </div>
        </SheetHeader>

        {localUser && (
          <div className="h-[calc(100vh-80px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent" dir="rtl">
            <div className="p-6 space-y-8 min-w-0">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-400" />
                  מידע בסיסי
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">שם:</span>
                    <span className="text-white font-medium">{localUser.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">שם משתמש:</span>
                    <span className="text-white font-medium">@{localUser.username}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">תאריך הצטרפות:</span>
                    <span className="text-white font-medium">{formatDate(localUser.createdAt)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">סטטוס:</span>
                    {getStatusBadge(localUser)}
                  </div>
                </div>
              </div>

              {/* Points in Group */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  נקודות בקבוצה
                </h3>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400 mb-2">
                      {userPoints?.count || 0}
                    </div>
                    <div className="text-sm text-gray-400">נקודות צבורות</div>
                    <div className="w-full bg-gray-600/50 rounded-full h-2 mt-3">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min(((userPoints?.count || 0) / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Categories */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-400" />
                    תגיות משתמש
                  </h3>
                  <Button
                    onClick={() => {
                      if (editingCategories) {
                        handleSaveCategories();
                      } else {
                        setEditingCategories(true);
                        setTempUserCategories(localUser.userCategories);
                      }
                    }}
                    variant="outline"
                    size="sm"
                    disabled={updateUserCategories.isPending}
                    className="border-gray-600/50 hover:bg-gray-700/50"
                  >
                    {updateUserCategories.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : editingCategories ? (
                      <>
                        <Save className="w-4 h-4 ml-2" />
                        שמור
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4 ml-2" />
                        ערוך
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="bg-gray-700/30 rounded-lg p-4">
                  {editingCategories ? (
                    <div className="space-y-3">
                      {categories?.map((category) => (
                        <div key={category.id} className="flex items-center gap-3">
                          <Checkbox
                            checked={tempUserCategories.includes(category.id)}
                            onCheckedChange={() => handleToggleCategory(category.id)}
                            className="border-gray-600/50 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <span className="text-white">{category.displayName}</span>
                        </div>
                      ))}
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={handleSaveCategories}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          disabled={updateUserCategories.isPending}
                        >
                          שמור שינויים
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingCategories(false);
                            setTempUserCategories(localUser.userCategories);
                          }}
                          variant="outline"
                          size="sm"
                          className="border-gray-600/50 hover:bg-gray-700/50"
                        >
                          ביטול
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 flex-wrap">
                      {getUserCategories(localUser).map((category) => (
                        <Badge 
                          key={category.id} 
                          variant="secondary"
                          className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                        >
                          {category.displayName}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Statistics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  סטטיסטיקות
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{shiftsThisMonth || 0}</div>
                      <div className="text-sm text-gray-400">משמרות החודש</div>
                    </div>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{totalShifts || 0}</div>
                      <div className="text-sm text-gray-400">סך הכל משמרות</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shift History */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  היסטוריית משמרות בקבוצה
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {shiftHistory && shiftHistory.length > 0 ? (
                    shiftHistory.slice(0, 5).map((shift) => (
                      <div key={shift.id} className="bg-gray-700/30 rounded-lg p-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div>
                            <div className="font-medium text-white">{shift.type}</div>
                            <div className="text-sm text-gray-400">{formatDate(shift.date)}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-white">{shift.duration} שעות</div>
                            <div className="text-blue-400">+{shift.points} נק׳</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="text-center text-gray-400">
                        <Clock className="w-8 h-8 mx-auto mb-2" />
                        <p>אין היסטוריית משמרות</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Upcoming Shifts */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  משמרות עתידיות
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {upcomingShifts && upcomingShifts.length > 0 ? (
                    upcomingShifts.slice(0, 5).map((shift) => (
                      <div key={shift.id} className="bg-gray-700/30 rounded-lg p-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div>
                            <div className="font-medium text-white">{shift.type}</div>
                            <div className="text-sm text-gray-400">{formatDate(shift.date)}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-white">{shift.startTime} - {shift.endTime}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="text-center text-gray-400">
                        <Clock className="w-8 h-8 mx-auto mb-2" />
                        <p>אין משמרות עתידיות מתוכננות</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Actions - Only at bottom */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-orange-400" />
                  פעולות ניהול
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleToggleAdmin}
                    variant={isGroupAdmin ? "destructive" : "default"}
                    size="sm"
                    className={`text-xs px-3 py-1.5 ${isGroupAdmin ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
                    disabled={updateUserRole.isPending}
                  >
                    {updateUserRole.isPending ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    ) : isGroupAdmin ? (
                      <>
                        <ShieldOff className="w-3 h-3 ml-1" />
                        הסר הרשאות ניהול
                      </>
                    ) : (
                      <>
                        <Shield className="w-3 h-3 ml-1" />
                        הפוך למנהל
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleRemoveUser}
                    variant="destructive"
                    size="sm"
                    className="text-xs px-3 py-1.5 bg-red-600 hover:bg-red-700"
                    disabled={updateUserRole.isPending}
                  >
                    <Trash2 className="w-3 h-3 ml-1" />
                    הסר מהקבוצה
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}; 