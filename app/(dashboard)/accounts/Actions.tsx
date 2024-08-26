"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";

import { useDeleteAccount } from "@/features/accounts/api/useDeleteAccount";
import { useEditAccountSheet } from "@/features/accounts/hooks/useEditAccountSheet";

import { useConfirm } from "@/hooks/useConfirm";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const { onOpen } = useEditAccountSheet();
  const deleteAccountMutation = useDeleteAccount(id);

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You're about to delete this account. This action cannot be undone.",
  );

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteAccountMutation.mutate();
    }
  };

  const isDisabled = deleteAccountMutation.isPending;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={isDisabled} onClick={() => onOpen(id)}>
            <Edit className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem disabled={isDisabled} onClick={onDelete}>
            <Trash className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog />
    </>
  );
};
