import { AccountForm } from "@/features/accounts/components/AccountForm";
import { useNewAccountSheet } from "@/features/accounts/hooks/useNewAccountSheet";
import { useCreateAccount } from "@/features/accounts/api/useCreateAccount";
import { FormValues } from "@/features/accounts/components/AccountForm";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccountSheet();

  const createAccountMutation = useCreateAccount();

  const onSubmit = (values: FormValues) => {
    createAccountMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          onSubmit={onSubmit}
          disabled={createAccountMutation.isPending}
        />
      </SheetContent>
    </Sheet>
  );
};
