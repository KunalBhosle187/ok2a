"use client";

import { IconAI, IconUser } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

// Different types of message bubbles.

export function UserMessage({ children }) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-background">
        <IconUser />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1 mt-1 font-semibold">
        {children}
      </div>
    </div>
  );
}

export function BotMessage({ children, className }) {
  return (
    <div className={cn("group relative flex items-start md:-ml-12", className)}>
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-primary text-primary-foreground">
        <IconAI />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1 prose-invert ">
        {children}
      </div>
    </div>
  );
}

export function BotCard({ children, showAvatar = true }) {
  return (
    <div className="group relative flex items-start md:-ml-12 w-[700px]">
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-primary text-primary-foreground",
          !showAvatar && "invisible"
        )}
      >
        <IconAI />
      </div>
      <div className="border-b-2 flex-1 ml-4 pb-4 px-1">{children}</div>
    </div>
  );
}

export function SystemMessage({ children }) {
  return (
    <div
      className={
        " flex items-center justify-center gap-2 text-xs text-gray-500"
      }
    >
      <div className={"max-w-[600px] w-full flex-initial px-2 "}>
        {children}
      </div>
    </div>
  );
}
