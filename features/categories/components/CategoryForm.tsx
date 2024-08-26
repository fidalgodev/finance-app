import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { insertCategorySchema } from "@/db/schema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export type FormValues = z.infer<typeof insertCategorySchema>;

type Props = {
  id?: string;
  initialValues?: FormValues;
  onDelete?: () => void;
  onSubmit: (values: FormValues) => void;
  disabled?: boolean;
};

export const CategoryForm = ({
  id,
  initialValues = {
    name: "",
  },
  onDelete,
  onSubmit,
  disabled,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: initialValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="E.g. Food, Travel, Shopping, etc."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled}>
          {id ? "Save changes" : "Create category"}
        </Button>
        {id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant="outline"
          >
            <Trash className="mr-2 size-4" /> Delete category
          </Button>
        )}
      </form>
    </Form>
  );
};
