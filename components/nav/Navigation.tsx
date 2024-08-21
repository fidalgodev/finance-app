"use client";

import { NavButton } from "@/components/nav/NavButton";
import { usePathname } from "next/navigation";
import { useMedia } from "react-use";
import { MobileNav } from "@/components/nav/MobileNav";

const routes = [
  {
    href: "/",
    label: "Dashboard",
  },
  {
    href: "/transactions",
    label: "Transactions",
  },
  {
    href: "/accounts",
    label: "Accounts",
  },
  {
    href: "/categories",
    label: "Categories",
  },
  {
    href: "/settings",
    label: "Settings",
  },
];

export const Navigation = () => {
  const pathname = usePathname();
  const isMobile = useMedia("(max-width: 1024px)", false);

  const isActive = (href: string) => pathname === href;

  if (isMobile) {
    return <MobileNav routes={routes} />;
  }

  return (
    <nav className="hidden items-center gap-x-4 overflow-x-auto lg:flex">
      {routes.map((route) => (
        <NavButton
          key={route.href}
          href={route.href}
          isActive={isActive(route.href)}
        >
          {route.label}
        </NavButton>
      ))}
    </nav>
  );
};
