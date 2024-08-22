"use client";

import { NewAccountSheet } from "@/features/accounts/components/NewAccountSheet";
import { EditAccountSheet } from "@/features/accounts/components/EditAccountSheet";

export const SheetProvider = () => {
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
    </>
  );
};
