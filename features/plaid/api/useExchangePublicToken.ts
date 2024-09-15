import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

// Response and Request types of the API
type ResponseType = InferResponseType<
  (typeof client.api.plaid)["exchange-public-token"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.plaid)["exchange-public-token"]["$post"]
>["json"];

export const useExchangePublicToken = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.plaid["exchange-public-token"].$post({
        json,
      });

      // We need to throw an error to trigger the onError callback
      if (!response.ok) {
        throw new Error("Failed to exchange public token");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Public token exchanged successfully");
      // TODO: Reinvalidate - connected-bank, summary, transactions, accounts, summary
    },
    onError: () => {
      toast.error("Failed to exchange public token");
    },
  });

  return mutation;
};
