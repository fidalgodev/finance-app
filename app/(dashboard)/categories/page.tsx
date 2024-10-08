"use client";

import { Loader2, Plus } from "lucide-react";

import {
  useBulkDeleteCategories,
  useGetCategories,
} from "@/features/categories/api";
import { useNewCategorySheet } from "@/features/categories/hooks";

import { columns } from "@/app/(dashboard)/categories/columns";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CategoriesPage = () => {
  const newCategorySheet = useNewCategorySheet();

  const categoriesQuery = useGetCategories();
  const deleteCategoriesMutation = useBulkDeleteCategories();

  const isLoadingCategories = categoriesQuery.isLoading;
  const isDeletingCategories = deleteCategoriesMutation.isPending;

  const isDisabled = isDeletingCategories || isLoadingCategories;

  if (isLoadingCategories) {
    return (
      <div className="mx-auto -mt-24 max-w-screen-xl pb-10">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="flex h-[500px] items-center justify-center">
              <Loader2 className="size-6 animate-spin text-slate-300" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto -mt-24 max-w-screen-xl pb-10">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="line-clamp-1 text-xl">Categories</CardTitle>
          <Button size="sm" onClick={newCategorySheet.onOpen}>
            <Plus className="mr-2 size-4" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={categoriesQuery.data || []}
            filterKey="name"
            onDelete={(rows) => {
              const ids = rows.map((r) => r.original.id);
              deleteCategoriesMutation.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesPage;
