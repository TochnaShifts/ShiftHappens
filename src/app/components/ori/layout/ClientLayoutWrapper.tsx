import React, { ReactNode, useMemo } from "react";
import { redirect } from "next/navigation";
import { ClientLayout } from "@/app/components/ori/layout/ClientLayout";
import { Group, User, UserCategory } from "@/app/shared/types";
import { UserProvider } from "@/app/contexts/UserContext";

type Props = {
  user: User | null;
  children: ReactNode;
};

export const ClientLayoutWrapper = ({ user, children }: Props) => {
  const memoUser = useMemo(() => user, [user]);
  if (!memoUser) redirect("/auth");
  if (memoUser?.isGlobalAdmin) redirect("/global-admin");

  return <ClientLayout>{children}</ClientLayout>;
};

