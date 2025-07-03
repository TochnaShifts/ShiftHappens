"use client";

import React from "react";
import { UserProvider } from "@/app/contexts/UserContext";
import { User } from "@/app/shared/types";
import { ClientLayoutWrapper } from "@/app/components/ori/layout/ClientLayoutWrapper";
import { DehydratedState, HydrationBoundary } from "@tanstack/react-query";

type Props = {
  user: User | null;
  dehydratedState: DehydratedState;
  children: React.ReactNode;
};

const ClientShellComponent = ({
  user,
  dehydratedState,
  children,
}: Props) => {
  return (
    <HydrationBoundary state={dehydratedState}>
      <UserProvider initialUser={user}>
        <ClientLayoutWrapper user={user}>{children}</ClientLayoutWrapper>
      </UserProvider>
    </HydrationBoundary>
  );
};

const ClientShell = React.memo(ClientShellComponent);
export default ClientShell;
