"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Globe, Shield, Home, LogOut, Menu, X } from "lucide-react";
import { useUser } from "@/app/contexts/UserContext";
import { SidebarUserInfo } from "./SidebarUserInfo";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarSectionTitle } from "./SidebarSectionTitle";
import { SidebarNavButton } from "./SidebarNavButton";

import { regularUserNav, groupAdminNav, globalAdminNav } from "./navConfig";

import { Button } from "@/app/components/loveable";
import { getGroupsByIds } from "@/app/shared/firebase/CRUD/groups";
import { queryKeys } from "@/app/shared/utils/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminGroups, fetchUserGroups } from "@/app/shared/queries/userQueries";
import { useUserAdminGroups, useUserGroups } from "@/app/shared/hooks";
import { LoadingSpinner } from "@/app/components";

export const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const { user, signOut } = useUser();
  const { data: userGroups } = useUserGroups(user)
  const { data: groupsAdmin } = useUserAdminGroups(user)

  console.log(groupsAdmin)
  if (!userGroups || !groupsAdmin) {
    return <LoadingSpinner size="md" fullPage />
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");
  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const closeMobile = () => setMobileOpen(false);
  
  // User status info
  const getUserStatus = () => {
    if (user?.isGlobalAdmin)
      return { label: "מנהל מערכת", icon: Globe, color: "text-red-500" };
    if (groupsAdmin.length > 0)
      if (isInGroupAdmin) {
        return {
          label: `מנהל ${
            userGroups.find((g) => g.id === currentGroupId)?.displayName
          }`,
          icon: Shield,
          color: "text-orange-400",
        };
      } else {
        return {
          label: `מנהל ${groupsAdmin.length} קבוצות`,
          icon: Shield,
          color: "text-orange-400",
        };
      }
    return { label: "משתמש רגיל", icon: null, color: "text-gray-400" };
  };

  // Determine sidebar mode:
  // Are we inside a groupAdmin screen? (URL pattern: /group-admin/[groupId]/...)
  const isInGroupAdmin =pathname.startsWith("/group-admin") && !!params?.groupId;
  const currentGroupId = params?.groupId;


  useEffect(() => {
  }, [userGroups]);

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
          onClick={toggleMobile}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed z-50 top-0 right-0 h-full w-64 bg-gray-900 border-l border-gray-700
          flex flex-col shadow-lg transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}
        dir="rtl"
      >
        <SidebarHeader />

        <SidebarUserInfo
          user={user}
          status={getUserStatus()}
          onNotificationsClick={() => alert("מערכת ההתראות תהיה זמינה בקרוב")}
        />

        <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* --- GLOBAL ADMIN MODE --- */}
          {user?.isGlobalAdmin && (
            <>
              <SidebarSectionTitle
                icon={Globe}
                color="text-red-500"
                title="מנהל מערכת"
              />
              {globalAdminNav.map((item) => (
                <SidebarNavButton
                  key={item.path}
                  path={item.path}
                  active={isActive(item.path)}
                  icon={item.icon}
                  label={item.label}
                  colorActive="from-red-500 to-red-600"
                  onClick={closeMobile}
                />
              ))}
            </>
          )}

          {/* --- GROUP ADMIN MODE (inside a specific group) --- */}
          {!user?.isGlobalAdmin && isInGroupAdmin && currentGroupId && (
            <>
              <SidebarSectionTitle
                icon={Shield}
                color="text-orange-500"
                title="ניהול קבוצה"
              />
              {/* Find the group for the current ID */}
              {userGroups
                .filter((g) => g.id === currentGroupId)
                .map(({ id }) => {
                  const navItems = groupAdminNav(id);
                  return (
                    <>
                      {navItems.map((item) => (
                        <SidebarNavButton
                          key={item.path}
                          path={item.path}
                          active={isActive(item.path)}
                          icon={item.icon}
                          label={item.label}
                          colorActive="from-orange-500 to-orange-600"
                          onClick={closeMobile}
                        />
                      ))}
                    </>
                  );
                })}
              {/* Switch to another group admin view */}
              {userGroups.filter((g) => g.id !== currentGroupId).length >
                0 && (
                <>
                  <hr className="border-gray-700 my-2" />
                  <SidebarSectionTitle
                    icon={Shield}
                    color="text-orange-400"
                    title="ניהול קבוצות נוספות"
                  />
                  {groupsAdmin
                    .filter((g) => g.id !== currentGroupId)
                    .map(({ id, displayName }) => (
                      <SidebarNavButton
                        key={id}
                        path={`/group-admin/${id}/dashboard`}
                        active={pathname.startsWith(`/group-admin/${id}`)}
                        icon={Shield}
                        label={displayName}
                        colorActive="from-orange-400 to-orange-500"
                        onClick={closeMobile}
                      />
                    ))}
                </>
              )}

              {/* Back to main user screen */}
              <div className="p-3 md:p-4 border-t border-gray-700">
                <SidebarNavButton
                  path="/user/dashboard"
                  active={false}
                  icon={Home}
                  label="חזרה למסך הראשי"
                  colorActive="from-gray-500 to-gray-700"
                  onClick={closeMobile}
                  className="w-full justify-start border-blue-500 text-blue-400 hover:bg-blue-900/60 mb-2 text-sm p-2"
                  variant="outline"
                />
              </div>
            </>
          )}

          {/* --- REGULAR USER MODE --- */}
          {!user?.isGlobalAdmin && !isInGroupAdmin && (
            <>
              <SidebarSectionTitle
                icon={Home}
                color="text-blue-500"
                title="כללי"
              />
              {regularUserNav.map((item) => (
                <SidebarNavButton
                  key={item.path}
                  path={item.path}
                  active={isActive(item.path)}
                  icon={item.icon}
                  label={item.label}
                  colorActive="from-blue-500 to-blue-600"
                  onClick={closeMobile}
                />
              ))}

              {groupsAdmin.length > 0 && (
                <>
                  <hr className="border-gray-700 my-2" />
                  <SidebarSectionTitle
                    icon={Shield}
                    color="text-orange-500"
                    title="ניהול קבוצות"
                  />
                  {/* Show one tab per group */}
                  {groupsAdmin.map(({ id, displayName }) => (
                    <SidebarNavButton
                      key={id}
                      path={`/group-admin/${id}/dashboard`}
                      active={pathname.startsWith(`/group-admin/${id}`)}
                      icon={Shield}
                      label={displayName}
                      colorActive="from-orange-500 to-orange-600"
                      onClick={closeMobile}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <Button
            variant="ghost"
            size="lg"
            className="w-full justify-start text-red-400 hover:bg-red-900/20 hover:text-red-300"
            onClick={() => {
              signOut();
              closeMobile();
            }}
          >
            <LogOut className="w-5 h-5 ml-3" />
            התנתק
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
