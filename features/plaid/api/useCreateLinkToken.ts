import { useMutation } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

// Response and Request types of the API
type ResponseType = InferResponseType<
  (typeof client.api.plaid)["create-link-token"]["$post"],
  200
>;

export const useCreateLinkToken = () => {
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.plaid["create-link-token"].$post();

      // We need to throw an error to trigger the onError callback
      if (!response.ok) {
        throw new Error("Failed to create token");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Link token created");
    },
    onError: () => {
      toast.error("Failed to create link token");
    },
  });

  return mutation;
};
