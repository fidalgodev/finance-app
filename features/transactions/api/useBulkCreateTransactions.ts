import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

// Response and Request types of the API
type ResponseType = InferResponseType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>["json"];

export const useBulkCreateTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await client.api.transactions["bulk-create"].$post({
        json: values,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transactions created");

      // Invalidate the transactions query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      // TODO: Invalidate the summary query
    },
    onError: () => {
      toast.error("Failed to create transactions");
    },
  });

  return mutation;
};
