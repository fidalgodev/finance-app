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
import { NewTransactionSheet } from "@/features/transactions/components";

// import { EditCategorySheet } from "@/features/categories/components/EditCategorySheet";

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
    </>
  );
};
