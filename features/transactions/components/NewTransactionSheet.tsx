import { Loader2 } from "lucide-react";

import { useCreateAccount, useGetAccounts } from "@/features/accounts/api";
import { useCreateCategory, useGetCategories } from "@/features/categories/api";
import { useCreateTransaction } from "@/features/transactions/api";
import {
  type ApiFormValues,
  TransactionForm,
} from "@/features/transactions/components";
import { useNewTransactionSheet } from "@/features/transactions/hooks";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransactionSheet();

  const createTransactionMutation = useCreateTransaction();

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
    createTransactionMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const isDisabled =
    createTransactionMutation.isPending ||
    categoriesMutation.isPending ||
    accountsMutation.isPending;

  const isLoading = categoriesQuery.isLoading || accountsQuery.isLoading;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Add a new transaction.</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={isDisabled}
            categoryOptions={categoriesOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={accountsOptions}
            onCreateAccount={onCreateAccount}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
