"use client";

import { Loader2, Plus } from "lucide-react";

import { useBulkDeleteAccounts, useGetAccounts } from "@/features/accounts/api";
import { useNewAccountSheet } from "@/features/accounts/hooks";

import { columns } from "@/app/(dashboard)/accounts/columns";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AccountsPage = () => {
  const newAccountSheet = useNewAccountSheet();

  const accountsQuery = useGetAccounts();
  const deleteAccountsMutation = useBulkDeleteAccounts();

  const isLoadingAccounts = accountsQuery.isLoading;
  const isDeletingAccounts = deleteAccountsMutation.isPending;

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
          <Button size="sm" onClick={newAccountSheet.onOpen}>
            <Plus className="mr-2 size-4" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={accountsQuery.data || []}
            filterKey="name"
            onDelete={(rows) => {
              const ids = rows.map((r) => r.original.id);
              deleteAccountsMutation.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
