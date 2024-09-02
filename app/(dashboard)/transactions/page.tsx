"use client";

import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useSelectAccount } from "@/features/accounts/hooks";
import {
  useBulkCreateTransactions,
  useBulkDeleteTransactions,
  useGetTransactions,
} from "@/features/transactions/api";
import { type ApiValues as Transaction } from "@/features/transactions/components/TransactionForm";
import { useNewTransactionSheet } from "@/features/transactions/hooks";

import { columns } from "@/app/(dashboard)/transactions/columns";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { ImportCard } from "./ImportCard";
import { UploadButton } from "./UploadButton";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

const TransactionsPage = () => {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  const newTransactionSheet = useNewTransactionSheet();

  const transactionsQuery = useGetTransactions();
  const deleteTransactionsMutation = useBulkDeleteTransactions();
  const createBulkTransactionsMutation = useBulkCreateTransactions();

  const isLoadingTransactions = transactionsQuery.isLoading;
  const isDeletingTransactions = deleteTransactionsMutation.isPending;

  const isDisabled = isDeletingTransactions || isLoadingTransactions;

  // CSV import
  const onUpload = (data: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(data);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const onSubmitImport = async (values: Transaction[]) => {
    const accountId = await confirm();

    console.log(accountId, "accountId");

    if (!accountId) {
      return toast.error("Please select an account");
    }

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }));

    createBulkTransactionsMutation.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      },
    });
  };

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

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }

  return (
    <div className="mx-auto -mt-24 max-w-screen-xl pb-10">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="line-clamp-1 text-xl">Transactions</CardTitle>
          <div className="flex gap-2 flex-col lg:flex-row">
            <Button
              size="sm"
              className="w-full lg:w-auto"
              onClick={newTransactionSheet.onOpen}
            >
              <Plus className="mr-2 size-4" />
              Add new
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
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
