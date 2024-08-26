"use client";

// Accounts
import {
  EditAccountSheet,
  NewAccountSheet,
} from "@/features/accounts/components";
// Categories
import {
  EditCategorySheet,
  NewCategorySheet,
} from "@/features/categories/components";
// Transactions
import {
  EditTransactionSheet,
  NewTransactionSheet,
} from "@/features/transactions/components";

export const SheetProvider = () => {
  return (
    <>
      {/* Accounts */}
      <NewAccountSheet />
      <EditAccountSheet />

      {/* Categories */}
      <NewCategorySheet />
      <EditCategorySheet />

      {/* Transactions */}
      <NewTransactionSheet />
      <EditTransactionSheet />
    </>
  );
};
