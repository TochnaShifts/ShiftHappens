"use client";

import { Input } from "@/app/components/loveable/input";
import { Badge } from "@/app/components/loveable/badge";
import { Select, SelectItem } from "@/app/components/loveable/select";
import { Button } from "@/app/components/loveable/button";
import { Checkbox } from "@/app/components/loveable/checkbox";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { UserCategory } from "@/app/shared/types";

interface UserSearchAndFiltersProps {
  categories: UserCategory[];
  groupId: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortBy: 'name' | 'points' | 'status';
  setSortBy: (value: 'name' | 'points' | 'status') => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (value: 'asc' | 'desc') => void;
  selectedCategories: string[];
  setSelectedCategories: (value: string[] | ((prev: string[]) => string[])) => void;
}

export const UserSearchAndFilters = ({ 
  categories, 
  groupId,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  selectedCategories,
  setSelectedCategories
}: UserSearchAndFiltersProps) => {
  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('asc');
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev: string[]) => 
      prev.includes(categoryId) 
        ? prev.filter((id: string) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="חפש משתמשים..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <Select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-40 lg:w-40 w-full bg-gray-700/50 border-gray-600/50 text-white"
          >
            <SelectItem value="name">שם</SelectItem>
            <SelectItem value="points">נקודות</SelectItem>
            <SelectItem value="status">סטטוס</SelectItem>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSort(sortBy)}
            className="hover:bg-gray-700/50 text-gray-300 hover:text-white lg:p-2 p-3"
          >
            <ArrowUpDown className={`w-4 h-4 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      {categories && categories.length > 0 && (
        <div className="pt-4 border-t border-gray-700/30">
          <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300 lg:text-sm text-xs">סינון לפי תגיות (כל התגיות הנבחרות):</span>
            </div>
            {selectedCategories.length > 0 && (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 lg:text-sm text-xs">
                {selectedCategories.length} נבחרו
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2 lg:gap-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-1 lg:gap-2">
                <div className="lg:block hidden">
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                    className="border-gray-600/50 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                </div>
                <div className="lg:hidden block">
                  <div 
                    className={`w-3 h-3 border rounded-sm cursor-pointer flex items-center justify-center ${
                      selectedCategories.includes(category.id)
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-600/50'
                    }`}
                    onClick={() => handleCategoryToggle(category.id)}
                  >
                    {selectedCategories.includes(category.id) && (
                      <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                    )}
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`lg:text-xs text-xs lg:px-3 px-2 lg:py-1.5 py-0.5 cursor-pointer transition-all duration-200 h-6 lg:h-auto ${
                    selectedCategories.includes(category.id)
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-md'
                      : 'bg-gray-700/50 text-gray-400 border-gray-600/50 hover:bg-gray-600/50 hover:border-gray-500/50'
                  }`}
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  {category.displayName}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 