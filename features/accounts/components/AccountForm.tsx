import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { insertAccountSchema } from "@/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export type FormValues = z.input<typeof insertAccountSchema>;

type Props = {
  id?: string;
  initialValues?: FormValues;
  onDelete?: () => void;
};

export const AccountForm = ({
  id,
  initialValues = {
    name: "",
  },
  onDelete,
}: Props) => {
  const { onClose } = useNewAccount();

  const mutation = useCreateAccount();

  const isDisabled = mutation.isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(insertAccountSchema),
    defaultValues: initialValues,
  });

  const handleSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
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
                  disabled={isDisabled}
                  placeholder="E.g. Current, Savings, Cash, Credit Card"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={isDisabled}>
          {id ? "Save changes" : "Create account"}
        </Button>
        {id && (
          <Button
            type="button"
            disabled={isDisabled}
            onClick={handleDelete}
            className="w-full"
            variant="outline"
          >
            <Trash className="mr-2 size-4" /> Delete account
          </Button>
        )}
      </form>
    </Form>
  );
};
