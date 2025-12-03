"use client";

import {
  LayoutDashboard,
  Gamepad2,
  Package,
  Gift,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Server,
  Percent,
  Tag,
  Webhook,
  MessageCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const t = useTranslations("admin");
  const pathname = usePathname();

  const menuItems = [
    {
      title: t("dashboard"),
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t("games"),
      url: "/admin/games",
      icon: Gamepad2,
    },
    {
      title: t("giftCards"),
      url: "/admin/giftcards",
      icon: Gift,
    },
    {
      title: t("providers"),
      url: "/admin/providers",
      icon: Server,
    },
    {
      title: t("ordersMenu"),
      url: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: t("webhooks") || "Webhooks",
      url: "/admin/webhooks",
      icon: Webhook,
    },
    {
      title: t("chat") || "Chat",
      url: "/admin/chat",
      icon: MessageCircle,
    },
    {
      title: t("users"),
      url: "/admin/users",
      icon: Users,
    },
    {
      title: t("categories") || "Categories",
      url: "/admin/categories",
      icon: Tag,
    },
    {
      title: t("levels") || "Levels",
      url: "/admin/levels",
      icon: Package,
    },
    {
      title: t("instructors") || "Instructors",
      url: "/admin/instructors",
      icon: Users,
    },
    {
      title: t("categories") || "Categories",
      url: "/admin/categories",
      icon: Tag,
    },
    {
      title: t("levels") || "Levels",
      url: "/admin/levels",
      icon: Package,
    },
    {
      title: t("instructors") || "Instructors",
      url: "/admin/instructors",
      icon: Users,
    },
    {
      title: t("sales"),
      url: "/admin/sales",
      icon: Percent,
    },
    {
      title: t("tags"),
      url: "/admin/tags",
      icon: Tag,
    },
    {
      title: t("settings"),
      url: "/admin/settings",
      icon: Settings,
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">DR Games Admin</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("navigation")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.name ? getInitials(user.name) : "AD"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name || "Admin"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full justify-start" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          {t("logout")}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
