import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/hono";

// Response and Request types of the API
type ResponseType = InferResponseType<
  (typeof client.api.accounts)[":id"]["$delete"]
>;

export const useDeleteAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.accounts[":id"].$delete({
        param: {
          id,
        },
      });

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account deleted");

      // Invalidate the accounts and account query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });

      // TODO: Invalidate summary and transaction queries
    },
    onError: () => {
      toast.error("Failed to delete account");
    },
  });

  return mutation;
};
