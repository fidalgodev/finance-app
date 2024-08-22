import { Loader2 } from "lucide-react";

import { useDeleteAccount } from "@/features/accounts/api/useDeleteAccount";
import { useEditAccount } from "@/features/accounts/api/useEditAccount";
import { useGetAccount } from "@/features/accounts/api/useGetAccount";
import { AccountForm } from "@/features/accounts/components/AccountForm";
import { FormValues } from "@/features/accounts/components/AccountForm";
import { useEditAccountSheet } from "@/features/accounts/hooks/useEditAccountSheet";

import { useConfirm } from "@/hooks/useConfirm";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useEditAccountSheet();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You're about to delete this account. This action cannot be undone.",
  );

  const getAccountQuery = useGetAccount(id);
  const editAccountMutation = useEditAccount(id);
  const deleteAccountMutation = useDeleteAccount(id);

  const onSubmit = (values: FormValues) => {
    editAccountMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const initialValues = {
    name: getAccountQuery.data?.name || "",
  };

  const isDisabled =
    editAccountMutation.isPending || deleteAccountMutation.isPending;

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteAccountMutation.mutate(undefined, {
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
          {getAccountQuery.isLoading ? (
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
