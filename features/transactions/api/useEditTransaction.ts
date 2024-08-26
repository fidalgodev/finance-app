import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

// Response and Request types of the API
type ResponseType = InferResponseType<
  (typeof client.api.transactions)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)[":id"]["$patch"]
>["json"];

export const useEditTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await client.api.transactions[":id"].$patch({
        param: {
          id,
        },
        json: values,
      });

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transaction updated");

      // Invalidate the transactions and transaction query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      // TODO: Invalidate summary query
    },
    onError: () => {
      toast.error("Failed to edit transaction");
    },
  });

  return mutation;
};
