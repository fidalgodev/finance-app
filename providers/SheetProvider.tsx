"use client";

import { EditAccountSheet } from "@/features/accounts/components/EditAccountSheet";
import { NewAccountSheet } from "@/features/accounts/components/NewAccountSheet";

export const SheetProvider = () => {
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
    </>
  );
};
