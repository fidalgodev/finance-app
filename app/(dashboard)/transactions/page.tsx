"use client";

import { Loader2, Plus } from "lucide-react";

import {
  useBulkDeleteTransactions,
  useGetTransactions,
} from "@/features/transactions/api";
import { useNewTransactionSheet } from "@/features/transactions/hooks";

import { columns } from "@/app/(dashboard)/transactions/columns";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TransactionsPage = () => {
  const newTransactionSheet = useNewTransactionSheet();

  const transactionsQuery = useGetTransactions();
  const deleteTransactionsMutation = useBulkDeleteTransactions();

  const isLoadingTransactions = transactionsQuery.isLoading;
  const isDeletingTransactions = deleteTransactionsMutation.isPending;

  const isDisabled = isDeletingTransactions || isLoadingTransactions;

  if (isLoadingTransactions) {
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
          <CardTitle className="line-clamp-1 text-xl">
            Transactions page
          </CardTitle>
          <Button size="sm" onClick={newTransactionSheet.onOpen}>
            <Plus className="mr-2 size-4" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={transactionsQuery.data || []}
            filterKey="payee"
            onDelete={(rows) => {
              const ids = rows.map((r) => r.original.id);
              deleteTransactionsMutation.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
