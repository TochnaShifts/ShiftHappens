import { ReactNode } from "react";
import { redirect } from "next/navigation";
import ClientShell from "@/app/components/ori/layout/ClientShell";
import { loadUserContext } from "@/app/shared/loaders/loadUserContext";

export default async function GlobalAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
