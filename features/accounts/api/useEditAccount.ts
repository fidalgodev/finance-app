import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

// Response and Request types of the API
type ResponseType = InferResponseType<
  (typeof client.api.accounts)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.accounts)[":id"]["$patch"]
>["json"];

export const useEditAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await client.api.accounts[":id"].$patch({
        param: {
          id,
        },
        json: values,
      });

      // We need to throw an error to trigger the onError callback
      if (!response.ok) {
        throw new Error();
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account updated");

      // Invalidate the accounts and account query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });

      // TODO: Invalidate summary and transaction queries
    },
    onError: () => {
      toast.error("Failed to edit account");
    },
  });

  return mutation;
};
