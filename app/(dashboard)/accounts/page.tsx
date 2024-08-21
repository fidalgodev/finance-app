"use client";
import { Plus } from "lucide-react";

import { useNewAccount } from "@/features/accounts/hooks/use-new-account";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { columns, Payment } from "@/app/(dashboard)/accounts/columns";

const data: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed52f",
    amount: 50,
    status: "success",
    email: "a@example.com",
  },
  {
    id: "728ed52f",
    amount: 50,
    status: "success",
    email: "a@example.com",
  },
  {
    id: "728ed52f",
    amount: 50,
    status: "success",
    email: "a@example.com",
  },
];

const AccountsPage = () => {
  const { onOpen } = useNewAccount();

  return (
    <div className="mx-auto -mt-24 max-w-screen-xl pb-10">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="line-clamp-1 text-xl">Accounts page</CardTitle>
          <Button size="sm" onClick={onOpen}>
            <Plus className="mr-2 size-4" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} filterKey="email" />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
