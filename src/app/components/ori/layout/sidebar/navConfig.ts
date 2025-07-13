// components/layout/Sidebar/navConfig.ts
import {
    Calendar, Users, ClipboardList, Settings, LogOut, Bell, Shield, Home,
    BarChart3, Plus, FolderOpen, Archive, Globe, UserCog
  } from "lucide-react";
  
  export const regularUserNav = [
    { label: "לוח בקרה", path: "/user/dashboard", icon: BarChart3 },
    { label: "לוח שנה", path: "/user/calendar", icon: Calendar },
    { label: "בקשות", path: "/user/requests", icon: ClipboardList },
    { label: "נקודות", path: "/user/points", icon: Users },
  ];
  
  export const groupAdminNav = (groupId: string) => [
    { label: "לוח בקרה", path: `/group-admin/${groupId}/dashboard`, icon: BarChart3 },
    { label: "ניהול משתמשים", path: `/group-admin/${groupId}/users`, icon: Users },
    { label: "יצירת משמרת", path: `/group-admin/${groupId}/shifts/create`, icon: Plus },
    { label: "ניהול משמרות", path: `/group-admin/${groupId}/shifts`, icon: Calendar },
    { label: "ארכיון משמרות", path: `/group-admin/${groupId}/shifts/archive`, icon: Archive },
    { label: "ניהול בקשות", path: `/group-admin/${groupId}/requests`, icon: ClipboardList },
    { label: "תבניות", path: `/group-admin/${groupId}/templates`, icon: FolderOpen },
    { label: "נקודות", path: `/group-admin/${groupId}/points`, icon: BarChart3 },
    { label: "הגדרות קבוצה", path: `/group-admin/${groupId}/settings`, icon: Settings }
  ];
  
  export const globalAdminNav = [
    { label: "ניהול משתמשים", path: "/global-admin/users", icon: UserCog },
    { label: "יצירת משתמש", path: "/global-admin/create-user", icon: Plus },
    { label: "ניהול קבוצות", path: "/global-admin/groups", icon: Globe },
    { label: "הגדרות מערכת", path: "/global-admin/settings", icon: Settings }
  ];
  