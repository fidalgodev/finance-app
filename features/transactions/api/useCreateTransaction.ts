import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

// Response and Request types of the API
type ResponseType = InferResponseType<typeof client.api.transactions.$post>;
type RequestType = InferRequestType<
  typeof client.api.transactions.$post
>["json"];

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await client.api.transactions.$post({ json: values });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transaction created");

      // Invalidate the transactions query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      // TODO: Invalidate summary query
    },
    onError: () => {
      toast.error("Failed to create transaction");
    },
  });

  return mutation;
};
