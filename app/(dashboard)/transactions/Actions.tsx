"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";

import { useDeleteTransaction } from "@/features/transactions/api";
import { useEditTransactionSheet } from "@/features/transactions/hooks";

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
  const { onOpen } = useEditTransactionSheet();
  const deleteTransactionMutation = useDeleteTransaction(id);

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You're about to delete this transaction. This action cannot be undone.",
  );

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteTransactionMutation.mutate();
    }
  };

  const isDisabled = deleteTransactionMutation.isPending;

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
