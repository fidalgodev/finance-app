"use client";

import { useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useMount } from "react-use";

import {
  useCreateLinkToken,
  useExchangePublicToken,
} from "@/features/plaid/api";

import { Button } from "@/components/ui/button";

export const PlaidConnect = () => {
  const [token, setToken] = useState<string | null>(null);

  const createLinkToken = useCreateLinkToken();
  const exchangePublicToken = useExchangePublicToken();

  useMount(() => {
    createLinkToken.mutate(undefined, {
      onSuccess: ({ data }) => {
        setToken(data);
      },
    });
  });

  const { open, ready } = usePlaidLink({
    token,
    onSuccess: (public_token) => {
      exchangePublicToken.mutate({ public_token });
    },
    env: "sandbox",
  });

  const isDisabled = !ready || exchangePublicToken.isPending;

  return (
    <Button
      onClick={() => open()}
      disabled={isDisabled}
      size="sm"
      variant="ghost"
    >
      Connect
    </Button>
  );
};
