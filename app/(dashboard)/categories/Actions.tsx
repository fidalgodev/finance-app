"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";

import { useDeleteCategory } from "@/features/categories/api/useDeleteCategory";
import { useEditCategorySheet } from "@/features/categories/hooks/useEditCategorySheet";

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
  const { onOpen } = useEditCategorySheet();
  const deleteCategoryMutation = useDeleteCategory(id);

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You're about to delete this category. This action cannot be undone.",
  );

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteCategoryMutation.mutate();
    }
  };

  const isDisabled = deleteCategoryMutation.isPending;

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
