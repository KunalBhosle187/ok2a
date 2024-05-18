import React from "react";
import { AI } from "../action";
import { Header } from "@/components/header";

const ChatLayout = ({ children }) => {
  return (
    <div>
      <AI>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex flex-col flex-1 bg-muted/50 dark:bg-background">
            {children}
          </main>
        </div>
      </AI>
    </div>
  );
};

// export const runtime = "edge";
export default ChatLayout;
