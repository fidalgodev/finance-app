"use client";
import { useGetAccounts } from "@/features/accounts/api/useGetAccount";
import { Loader2, Plus } from "lucide-react";

import { useNewAccount } from "@/features/accounts/hooks/useNewAccount";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { columns } from "@/app/(dashboard)/accounts/columns";
import { useBulkDeleteAccounts } from "@/features/accounts/api/useBulkDelete";

const AccountsPage = () => {
  const { onOpen } = useNewAccount();
  const { data: accounts, isLoading: isLoadingAccounts } = useGetAccounts();
  const { mutate: bulkDeleteAccounts, isPending: isDeletingAccounts } =
    useBulkDeleteAccounts();

  const isDisabled = isDeletingAccounts || isLoadingAccounts;

  if (isLoadingAccounts) {
    return (
      <div className="mx-auto -mt-24 max-w-screen-xl pb-10">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="flex h-[500px] items-center justify-center">
              <Loader2 className="size-6 animate-spin text-slate-300" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <DataTable
            columns={columns}
            data={accounts || []}
            filterKey="name"
            onDelete={(rows) => {
              const ids = rows.map((r) => r.original.id);
              bulkDeleteAccounts({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
