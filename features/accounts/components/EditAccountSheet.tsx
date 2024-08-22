import { Loader2 } from "lucide-react";
import { AccountForm } from "@/features/accounts/components/AccountForm";
import { useOpenAccount } from "@/features/accounts/hooks/useOpenAccount";
import { useEditAccount } from "@/features/accounts/api/useEditAccount";
import { useDeleteAccount } from "@/features/accounts/api/useDeleteAccount";
import { useGetAccount } from "@/features/accounts/api/useGetAccount";
import { FormValues } from "@/features/accounts/components/AccountForm";

import { useConfirm } from "@/hooks/useConfirm";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You're about to delete this account. This action cannot be undone.",
  );

  const { data: account, isLoading: isFetchingAccount } = useGetAccount(id);
  const { mutate: editAccount, isPending: editingAccount } = useEditAccount(id);
  const { mutate: deleteAccount, isPending: deletingAccount } =
    useDeleteAccount(id);

  const onSubmit = (values: FormValues) => {
    editAccount(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const initialValues = {
    name: account?.name || "",
  };

  const isDisabled = editingAccount || deletingAccount;

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteAccount(undefined, {
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
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit the account details below.</SheetDescription>
          </SheetHeader>
          {isFetchingAccount ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <AccountForm
              id={id}
              initialValues={initialValues}
              disabled={isDisabled}
              onSubmit={onSubmit}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
      <ConfirmDialog />
    </>
  );
};
