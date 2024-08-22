import Link from "next/link";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

type Props = {
  href: string;
  isActive?: boolean;
  children: React.ReactNode;
};

export const NavButton = ({ href, isActive, children }: Props) => {
  return (
    <Button
      asChild
      size="sm"
      variant="outline"
      className={cn(
        "w-full border-none font-normal text-white outline-none transition hover:bg-white/20 hover:text-white focus:bg-white/30 focus-visible:ring-transparent focus-visible:ring-offset-0 lg:w-auto",
        isActive ? "bg-white/10" : "bg-transparent",
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};
