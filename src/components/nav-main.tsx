"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: {
    title: string;
    url: string;
  }[];
}

export function NavMain({
  label,
  items,
}: {
  label?: string;
  items: NavItem[];
}) {
  const pathname = usePathname();
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

  // Inisialisasi state saat komponen pertama kali dimount
  useEffect(() => {
    const initialStates = items.reduce(
      (acc, item) => {
        acc[item.url] = pathname.includes(item.url);
        return acc;
      },
      {} as Record<string, boolean>,
    );
    setOpenStates(initialStates);
  }, [items, pathname]);

  // Handler untuk mengubah state item tertentu
  const handleOpenChange = (url: string) => {
    setOpenStates((prev) => ({
      ...prev,
      [url]: !prev[url],
    }));
  };

  // Helper untuk mengecek apakah item atau sub-itemnya aktif
  const isItemActive = (item: NavItem) => {
    const isMainPathActive = pathname === item.url;
    const isSubPathActive = item.items?.some(
      (subItem) => pathname === subItem.url,
    );
    return isMainPathActive || isSubPathActive;
  };

  return (
    <SidebarGroup>
      {label ?? <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const isActive = isItemActive(item);
          const isOpen = openStates[item.url];

          return (
            <Collapsible
              key={item.title}
              asChild
              open={isOpen}
              onOpenChange={() => handleOpenChange(item.url)}
              defaultOpen={isActive}
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={pathname.includes(item.url) ? "bg-accent" : ""}
                >
                  <Link href={item.url}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction
                        className="transition-transform duration-200"
                        data-state={isOpen ? "open" : "closed"}
                      >
                        <ChevronRight
                          className={`h-4 w-4 transform transition-transform duration-200 ${
                            isOpen ? "rotate-90" : ""
                          }`}
                        />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={
                                pathname.includes(subItem.url)
                                  ? "bg-accent"
                                  : ""
                              }
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
