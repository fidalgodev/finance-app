import { Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Props = {
  routes: { href: string; label: string }[];
};

export const MobileNav = ({ routes }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  // This function is used to navigate to a different page when a mobile button is clicked
  // We don't use Link because it won't close the mobile menu
  const onButtonClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-none bg-white/10 font-normal text-white outline-none transition hover:bg-white/20 hover:text-white focus:bg-white/30 focus-visible:ring-transparent focus-visible:ring-offset-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-2">
        <SheetHeader>
          <SheetTitle hidden>Navigation</SheetTitle>
          <SheetDescription hidden>The navigation menu</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-y-4 pt-6">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={isActive(route.href) ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onButtonClick(route.href)}
            >
              {route.label}
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
