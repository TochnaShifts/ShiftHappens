"use client";

import React from "react";
import { UserProvider } from "@/app/contexts/UserContext";
import { Group, User, UserCategory } from "@/app/shared/types";
import { ClientLayoutWrapper } from "@/app/components/ori/layout/ClientLayoutWrapper";

type Props = {
  user: User | null;
  userGroups: Group[];
  groupsAdmin: Group[];
  userCategories: UserCategory[];
  children: React.ReactNode;
};

const ClientShellComponent = ({
  user,
  userGroups,
  groupsAdmin,
  userCategories,
  children,
}: Props) => {
  return (
    <UserProvider
      initialUser={user}
      initialUserGroups={userGroups}
      initialGroupsAdmin={groupsAdmin}
      initialUserCategories={userCategories}
    >
      <ClientLayoutWrapper user={user}>{children}</ClientLayoutWrapper>
    </UserProvider>
  );
};

const ClientShell = React.memo(ClientShellComponent);
export default ClientShell;
