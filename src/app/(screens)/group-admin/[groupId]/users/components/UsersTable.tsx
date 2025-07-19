"use client";

import { Card } from "@/app/components/loveable/card";
import { Badge } from "@/app/components/loveable/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/loveable/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/loveable/dropdown-menu";
import { Button } from "@/app/components/loveable/button";
import { Trash2, Edit, MoreVertical } from "lucide-react";
import { User, UserCategory } from "@/app/shared/types";
import { useUpdateUserRole } from "../hooks/userManagementHooks";
import { transliterate } from 'hebrew-transliteration';
import { generateSearchTerms } from "@/app/shared/utils/keyboardLayoutCorrection";

interface UserWithPoints extends User {
  points: number;
}

interface UsersTableProps {
  users: UserWithPoints[];
  categories: UserCategory[];
  groupId: string;
  onUserSelect?: (user: User) => void;
  searchTerm: string;
  sortBy: 'name' | 'points' | 'status';
  sortDirection: 'asc' | 'desc';
  selectedCategories: string[];
}

export const UsersTable = ({ 
  users, 
  categories, 
  groupId, 
  onUserSelect,
  searchTerm,
  sortBy,
  sortDirection,
  selectedCategories
}: UsersTableProps) => {
  const updateUserRole = useUpdateUserRole(groupId);

  const sortUsers = (users: UserWithPoints[]) => {
    return [...users].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'points':
          const aPoints = a.points || 0;
          const bPoints = b.points || 0;
          comparison = aPoints - bPoints;
          break;
        case 'status':
          const aStatus = getStatusPriority(a);
          const bStatus = getStatusPriority(b);
          comparison = aStatus - bStatus;
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const getStatusPriority = (user: UserWithPoints): number => {
    const isGroupAdmin = user.groups?.some(g => g.groupId === groupId && g.isAdmin);
    
    if (isGroupAdmin) return 3; // Group Admin - highest priority
    if (user.isActive) return 2; // Active - medium priority
    return 1; // Inactive - lowest priority
  };

  const filterUsers = (users: UserWithPoints[]) => {
    let filtered = users;

    // Search filter with Hebrew-English transliteration and keyboard layout correction
    if (searchTerm) {
      const searchTerms = generateSearchTerms(searchTerm);
      
      filtered = filtered.filter(user => {
        const nameLower = user.name.toLowerCase();
        const nameTransliterated = transliterate(nameLower);
        const usernameLower = user.username.toLowerCase();
        const usernameTransliterated = transliterate(usernameLower);
        
        // Check if any of the search terms (original + corrected) match
        return searchTerms.some(searchTerm => {
          const searchLower = searchTerm.toLowerCase().trim();
          const searchTransliterated = transliterate(searchLower);
          
          return nameLower.includes(searchLower) ||
                 nameTransliterated.includes(searchTransliterated) ||
                 usernameLower.includes(searchLower) ||
                 usernameTransliterated.includes(searchTransliterated);
        });
      });
    }

    // Category filter - users must have ALL selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(user => 
        selectedCategories.every(categoryId => 
          user.userCategories.includes(categoryId)
        )
      );
    }

    return sortUsers(filtered);
  };

  const filteredUsers = filterUsers(users);

  const handleRemoveUser = (userId: string) => {
    updateUserRole.mutate({ userId, action: 'removeFromGroup' });
  };

  const getStatusBadge = (user: UserWithPoints) => {
    const isGroupAdmin = user.groups?.some(g => g.groupId === groupId && g.isAdmin);
    
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

  const getUserCategories = (user: UserWithPoints) => {
    return categories.filter(cat => user.userCategories.includes(cat.id));
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700/50 hover:bg-gray-700/20">
              <TableHead className="text-right text-gray-200 min-w-[200px] font-medium">שם</TableHead>
              <TableHead className="text-right text-gray-200 hidden md:table-cell font-medium">תגיות</TableHead>
              <TableHead className="text-right text-gray-200 hidden sm:table-cell font-medium">נקודות</TableHead>
              <TableHead className="text-right text-gray-200 font-medium">סטטוס</TableHead>
              <TableHead className="text-right text-gray-200 w-16 font-medium">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow 
                key={user.id} 
                className="border-gray-700/30 hover:bg-gray-700/20 transition-colors cursor-pointer group"
                onClick={() => onUserSelect?.(user)}
              >
                <TableCell>
                  <div className="text-right group-hover:text-blue-400 transition-colors">
                    <div className="font-medium text-white group-hover:text-blue-400">{user.name}</div>
                    <div className="text-sm text-gray-400 group-hover:text-blue-400/70">@{user.username}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {getUserCategories(user).map((category) => (
                      <Badge 
                        key={category.id} 
                        variant="outline" 
                        className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
                      >
                        {category.displayName}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <UserPointsCell points={user.points} />
                </TableCell>
                <TableCell>{getStatusBadge(user)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="hover:bg-gray-700/50 text-gray-300 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800/95 border-gray-700/50 backdrop-blur-sm">
                      <DropdownMenuItem 
                        className="text-white hover:bg-gray-700/50 focus:bg-gray-700/50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUserSelect?.(user);
                        }}
                      >
                        צפה בפרטים
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white hover:bg-gray-700/50 focus:bg-gray-700/50">
                        <Edit className="w-4 h-4 ml-2" />
                        ערוך משתמש
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveUser(user.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 ml-2" />
                        הסר מהקבוצה
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

// Simplified points cell that receives points as prop
const UserPointsCell = ({ points }: { points: number }) => {
  const percentage = Math.min((points / 50) * 100, 100);

  return (
    <div className="flex items-center gap-2">
      <span className="text-white font-medium text-sm">{points}</span>
      <div className="w-16 bg-gray-700/50 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 shadow-sm" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}; 