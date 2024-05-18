import { DataTable } from "@/components/data-table/data-table";
import React from "react";
import { columns } from "./column";
import { getUser } from "@/lib/quries";

const Dashboard = async () => {
  const users = await getUser();
  console.log({ users });

  return (
    <div className="p-10">
      <h1 className="font-bold text-2xl">Users</h1>
      <p className="text-sm text-muted-foreground">
        Manage your users and view their details.
      </p>

      <div className="py-10">
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
};

export default Dashboard;
