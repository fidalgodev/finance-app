"use client";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";

export default function Home() {
  const { onOpen } = useNewAccount();

  return (
    <>
      <div>Home page</div>
      <button onClick={onOpen}>Open New Account</button>
    </>
  );
}
