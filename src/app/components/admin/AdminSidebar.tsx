'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  BookOpen,
  LayoutDashboard,
  Settings,
  LogOut,
  Shield,
  Users,
  GraduationCap,
  Tag,
  Layers,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { logout } from '@/actions/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/client';

interface AdminSidebarProps {
  locale: string;
}

export function AdminSidebar({ locale }: AdminSidebarProps) {
  const t = useTranslations('admin');
  const pathname = usePathname();
  const [user, setUser] = useState<{ email: string; fullName: string } | null>(
    null
  );

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        setUser({
          email: authUser.email || '',
          fullName:
            authUser.user_metadata?.full_name ||
            authUser.email?.split('@')[0] ||
            'Admin',
        });
      }
    };

    fetchUser();
  }, []);

  const menuItems = [
    {
      title: t('dashboard'),
      href: `/${locale}/admin/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: t('users'),
      href: `/${locale}/admin/users`,
      icon: Users,
    },
    {
      title: t('instructors'),
      href: `/${locale}/admin/instructors`,
      icon: GraduationCap,
    },
    {
      title: t('categories'),
      href: `/${locale}/admin/categories`,
      icon: Tag,
    },
    {
      title: t('levels'),
      href: `/${locale}/admin/levels`,
      icon: Layers,
    },
    {
      title: t('settings'),
      href: `/${locale}/admin/settings`,
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    await logout(locale);
  };

  // Get initials from full name or email
  const getInitials = () => {
    if (!user) return 'AD';
    if (user.fullName) {
      const names = user.fullName.split(' ');
      return names.length > 1
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0].substring(0, 2).toUpperCase();
    }
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <Sidebar
      side={locale === 'ar' ? 'right' : 'left'}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">{t('adminPortal')}</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('navigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            <AvatarFallback className="bg-red-100 text-red-700">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">
              {user?.fullName || 'Admin'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || t('loading')}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {t('logout')}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
