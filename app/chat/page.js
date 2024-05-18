import { auth } from "@/auth";
import React from "react";
import { ClientPage } from "../client-page";

const Index = async () => {
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;

  return (
    <>
      <ClientPage />
    </>
  );
};

export default Index;
