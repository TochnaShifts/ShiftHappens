"use client";

import { useState } from "react";
import { Card } from "@/app/components/loveable/card";
import { useGetGroupUsersWithPoints, useGetUserCategories } from "../hooks/userManagementHooks";
import { User } from "@/app/shared/types";
import { UserSearchAndFilters } from "./UserSearchAndFilters";
import { UsersTable } from "./UsersTable";
import { AddUsersModal } from "./AddUsersModal";

interface UserWithPoints extends User {
  points: number;
}

interface UserManagementTableProps {
  groupId: string;
  onUserSelect?: (user: User) => void;
}

export const UserManagementTable = ({ groupId, onUserSelect }: UserManagementTableProps) => {
  const { data: usersWithPoints, isLoading } = useGetGroupUsersWithPoints(groupId);
  const { data: categories } = useGetUserCategories();
  
  // Shared state for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'points' | 'status'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700/50 rounded-lg w-1/3"></div>
            <div className="h-64 bg-gray-700/50 rounded-lg"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <AddUsersModal groupId={groupId} />
        </div>

        <UserSearchAndFilters 
          categories={categories || []}
          groupId={groupId}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      </div>

      {/* Users Table */}
      <UsersTable 
        users={usersWithPoints || []}
        categories={categories || []}
        groupId={groupId}
        onUserSelect={onUserSelect}
        searchTerm={searchTerm}
        sortBy={sortBy}
        sortDirection={sortDirection}
        selectedCategories={selectedCategories}
      />
    </div>
  );
}; 