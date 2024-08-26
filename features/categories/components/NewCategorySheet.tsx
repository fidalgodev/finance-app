import { useCreateCategory } from "@/features/categories/api/useCreateCategory";
import { FormValues } from "@/features/categories/components/CategoryForm";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import { useNewCategorySheet } from "@/features/categories/hooks/useNewCategorySheet";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategorySheet();

  const createCategoryMutation = useCreateCategory();

  const onSubmit = (values: FormValues) => {
    createCategoryMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new category to organize your transactions.
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          onSubmit={onSubmit}
          disabled={createCategoryMutation.isPending}
        />
      </SheetContent>
    </Sheet>
  );
};
