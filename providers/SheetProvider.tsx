"use client";

// Accounts
import { EditAccountSheet } from "@/features/accounts/components/EditAccountSheet";
import { NewAccountSheet } from "@/features/accounts/components/NewAccountSheet";
// Categories
import { EditCategorySheet } from "@/features/categories/components/EditCategorySheet";
import { NewCategorySheet } from "@/features/categories/components/NewCategorySheet";

export const SheetProvider = () => {
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
      <NewCategorySheet />
      <EditCategorySheet />
    </>
  );
};
