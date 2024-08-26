import { useCreateAccount } from "@/features/accounts/api";
import { AccountForm, type FormValues } from "@/features/accounts/components";
import { useNewAccountSheet } from "@/features/accounts/hooks";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
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
