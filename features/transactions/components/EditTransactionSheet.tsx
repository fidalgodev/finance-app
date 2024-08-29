import { Loader2 } from "lucide-react";

import { useCreateAccount, useGetAccounts } from "@/features/accounts/api";
import { useCreateCategory, useGetCategories } from "@/features/categories/api";
import {
  useDeleteTransaction,
  useEditTransaction,
  useGetTransaction,
} from "@/features/transactions/api";
import {
  type ApiFormValues,
  TransactionForm,
} from "@/features/transactions/components";
import { useEditTransactionSheet } from "@/features/transactions/hooks";

import { useConfirm } from "@/hooks/useConfirm";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useEditTransactionSheet();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You're about to delete this transaction. This action cannot be undone.",
  );

  const transactionQuery = useGetTransaction(id);
  const editTransactionMutation = useEditTransaction(id);
  const deleteTransactionMutation = useDeleteTransaction(id);

  // Categories
  const categoriesQuery = useGetCategories();
  const categoriesMutation = useCreateCategory();

  const onCreateCategory = (name: string) => {
    categoriesMutation.mutate({ name });
  };

  const categoriesOptions = (categoriesQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  // Accounts
  const accountsQuery = useGetAccounts();
  const accountsMutation = useCreateAccount();

  const onCreateAccount = (name: string) => {
    accountsMutation.mutate({ name });
  };

  const accountsOptions = (accountsQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const onSubmit = (values: ApiFormValues) => {
    editTransactionMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const {
    accountId = "",
    categoryId = "",
    payee = "",
    date = "",
    amount = "",
    notes = "",
  } = transactionQuery.data || {};

  const initialValues = {
    accountId,
    categoryId,
    payee,
    date: new Date(date),
    amount: amount.toString(),
    notes,
  };

  const isDisabled =
    editTransactionMutation.isPending ||
    deleteTransactionMutation.isPending ||
    categoriesMutation.isPending ||
    accountsMutation.isPending;

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteTransactionMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>
              Edit the transaction details below.
            </SheetDescription>
          </SheetHeader>
          {transactionQuery.isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              defaultValues={initialValues}
              onSubmit={onSubmit}
              disabled={isDisabled}
              onDelete={onDelete}
              categoryOptions={categoriesOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountsOptions}
              onCreateAccount={onCreateAccount}
            />
          )}
        </SheetContent>
      </Sheet>
      <ConfirmDialog />
    </>
  );
};
