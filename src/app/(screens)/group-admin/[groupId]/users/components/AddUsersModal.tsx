"use client";

import { useState } from "react";
import { Button } from "@/app/components/loveable/button";
import { Input } from "@/app/components/loveable/input";
import { Badge } from "@/app/components/loveable/badge";
import { UserPlus, Search, X, Users } from "lucide-react";
import { User, UserCategory } from "@/app/shared/types";
import { useGetGroupUsersWithPoints, useGetAllUsers, useGetUserCategories, useAddUsersToGroup } from "../hooks/userManagementHooks";
import { transliterate } from 'hebrew-transliteration';

interface AddUsersModalProps {
  groupId: string;
}

export const AddUsersModal = ({ groupId }: AddUsersModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { data: groupUsers } = useGetGroupUsersWithPoints(groupId);
  const { data: allUsers } = useGetAllUsers();
  const { data: categories } = useGetUserCategories();
  const addUsersToGroup = useAddUsersToGroup(groupId);

  // Filter out users that are already in the group
  const currentUserIds = groupUsers?.map(user => user.id) || [];
  const availableUsers = allUsers?.filter(user => !currentUserIds.includes(user.id)) || [];
  
  const filteredAvailableUsers = availableUsers.filter(user => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase().trim();
    const searchTransliterated = transliterate(searchLower);
    
    const nameLower = user.name.toLowerCase();
    const nameTransliterated = transliterate(nameLower);
    const usernameLower = user.username.toLowerCase();
    const usernameTransliterated = transliterate(usernameLower);
    
    return nameLower.includes(searchLower) ||
           nameTransliterated.includes(searchTransliterated) ||
           usernameLower.includes(searchLower) ||
           usernameTransliterated.includes(searchTransliterated);
  });

  const handleUserToggle = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredAvailableUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleAddUsers = async () => {
    try {
      await addUsersToGroup.mutateAsync({ userIds: selectedUsers });
      
      // Reset state
      setSelectedUsers([]);
      setSearchTerm("");
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to add users to group:', error);
      // You might want to show a toast notification here
    }
  };

  const handleClose = () => {
    setSelectedUsers([]);
    setSearchTerm("");
    setIsOpen(false);
  };

  const getUserCategories = (user: User) => {
    if (!categories) return [];
    return categories.filter(cat => user.userCategories.includes(cat.id));
  };

  return (
    <div className="relative">
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-sm font-medium shadow-lg"
      >
        <UserPlus className="w-4 h-4 ml-2" />
        הוסף משתמשים לקבוצה
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 space-y-4" dir="rtl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">הוסף משתמשים לקבוצה</h2>
                <Button variant="ghost" size="sm" onClick={handleClose} className="hover:bg-gray-700/50">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="חפש משתמשים..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20"
                />
              </div>

              {/* Users List */}
              <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {filteredAvailableUsers.length > 0 ? (
                  <>
                    {/* Select All */}
                    <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredAvailableUsers.length && filteredAvailableUsers.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-white font-medium">בחר הכל</span>
                      {selectedUsers.length > 0 && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {selectedUsers.length} נבחרו
                        </Badge>
                      )}
                    </div>

                    {/* User Items */}
                    {filteredAvailableUsers.map((user) => (
                      <div 
                        key={user.id} 
                        className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => handleUserToggle(user.id, e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-400">@{user.username}</div>
                        </div>
                        <div className="flex gap-1">
                          {getUserCategories(user).map((category) => (
                            <Badge 
                              key={category.id} 
                              variant="outline" 
                              className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 border-blue-500/30"
                            >
                              {category.displayName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>לא נמצאו משתמשים זמינים</p>
                    <p className="text-sm">כל המשתמשים כבר בקבוצה או אין משתמשים במערכת</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
                <div className="text-sm text-gray-400">
                  {selectedUsers.length > 0 && `${selectedUsers.length} משתמשים נבחרו`}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="border-gray-600/50 hover:bg-gray-700/50"
                  >
                    ביטול
                  </Button>
                  <Button
                    onClick={handleAddUsers}
                    disabled={selectedUsers.length === 0 || addUsersToGroup.isPending}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    {addUsersToGroup.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 ml-2" />
                        הוסף לקבוצה
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 