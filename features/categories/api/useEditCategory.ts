import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

// Response and Request types of the API
type ResponseType = InferResponseType<
  (typeof client.api.categories)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.categories)[":id"]["$patch"]
>["json"];

export const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await client.api.categories[":id"].$patch({
        param: {
          id,
        },
        json: values,
      });

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category updated");

      // Invalidate the categories and account query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["category", { id }] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      // TODO: Invalidate summary and transaction queries
    },
    onError: () => {
      toast.error("Failed to edit category");
    },
  });

  return mutation;
};
