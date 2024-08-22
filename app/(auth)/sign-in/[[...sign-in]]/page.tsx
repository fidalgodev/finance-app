import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="h-full flex-col items-center justify-center px-4 lg:flex">
        <div className="space-y-4 pt-16 text-center">
          <h1 className="text-3xl font-bold text-[#2e2a47]">Welcome back</h1>
          <p className="text-base text-[#7e8ca0]">
            Login or create an account to get back to your dashboard!
          </p>
        </div>
        <div className="mt-8 flex items-center justify-center">
          {/* Loading Clerk */}
          <ClerkLoading>
            <Loader2 className="animate-spin text-muted-foreground" />
          </ClerkLoading>

          {/* Clerk Loaded */}
          <ClerkLoaded>
            <SignIn />
          </ClerkLoaded>
        </div>
      </div>
      <div className="full hidden items-center justify-center bg-blue-600 lg:flex">
        <Image src="/logo.svg" alt="Logo" width={150} height={150} />
      </div>
    </div>
  );
}
