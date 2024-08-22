import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/hono";

// Response and Request types of the API
type ResponseType = InferResponseType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteAccounts = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await client.api.accounts["bulk-delete"].$post({
        json: values,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Accounts deleted");

      // Invalidate the accounts query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["accounts"] });

      // TODO: Invalidate the summary query
    },
    onError: () => {
      toast.error("Failed to delete accounts");
    },
  });

  return mutation;
};
