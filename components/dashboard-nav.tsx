"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "ayazmo-plugin-admin/components/icons";
import { cn } from "ayazmo-plugin-admin/lib/utils";
import { NavItem } from "ayazmo-plugin-admin/types";
import { Dispatch, SetStateAction } from "react";
import navigation from 'ayazmo-plugin-admin/lib/navigation.json';

interface DashboardNavProps {
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({ setOpen }: DashboardNavProps) {
  const path = usePathname();

  if (!navigation?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {(navigation as NavItem[]).map((item, index) => {
        console.log(path === item.href)
        const Icon = Icons[item.icon || "arrowRight"];
        return (
          item.href && (
            <Link
              key={index}
              href={item.disabled ? "/" : item.href}
              onClick={() => {
                if (setOpen) setOpen(false);
              }}
            >
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === item.href ? "bg-slate-200" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80",
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}