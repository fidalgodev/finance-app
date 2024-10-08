import { Loader2 } from "lucide-react";

import {
  useDeleteCategory,
  useEditCategory,
  useGetCategory,
} from "@/features/categories/api";
import {
  CategoryForm,
  type FormValues,
} from "@/features/categories/components";
import { useEditCategorySheet } from "@/features/categories/hooks";

import { useConfirm } from "@/hooks/useConfirm";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useEditCategorySheet();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You're about to delete this category. This action cannot be undone.",
  );

  const categoryQuery = useGetCategory(id);
  const editCategoryMutation = useEditCategory(id);
  const deleteCategoryMutation = useDeleteCategory(id);

  const onSubmit = (values: FormValues) => {
    editCategoryMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const initialValues = {
    name: categoryQuery.data?.name || "",
  };

  const isDisabled =
    editCategoryMutation.isPending || deleteCategoryMutation.isPending;

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteCategoryMutation.mutate(undefined, {
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
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>
              Edit the category details below.
            </SheetDescription>
          </SheetHeader>
          {categoryQuery.isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <CategoryForm
              id={id}
              defaultValues={initialValues}
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
