import React from "react";
import { Header } from "@/components/header";

const DashLayout = ({ children }) => {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex flex-col flex-1 bg-muted/50 dark:bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashLayout;
