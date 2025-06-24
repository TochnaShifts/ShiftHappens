 "use client"

import React from "react"
import { useSidebar } from "./context"
import { Sheet, SheetContent } from "@/app/components/loveable/sheet"
import { cn } from "@/app/components/utils/utils"

export function Sidebar({
  children,
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
}: React.PropsWithChildren<{
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
  className?: string
}>) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === "none") {
    return (
      <div className={cn("flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground", className)}>
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side={side} className="w-72 bg-sidebar p-0 text-sidebar-foreground">
          {children}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      className={cn(
        "fixed inset-y-0 z-10 hidden w-64 flex-col bg-sidebar text-sidebar-foreground md:flex",
        className
      )}
    >
      {children}
    </div>
  )
}
