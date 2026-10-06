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
  GraduationCap,
  Users,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { logout } from '@/actions/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/client';
import { ChevronRight, Info, List } from 'lucide-react';

interface InstructorSidebarProps {
  locale: string;
}

export function InstructorSidebar({ locale }: InstructorSidebarProps) {
  const t = useTranslations('instructor');
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
            'Instructor',
        });
      }
    };

    fetchUser();
  }, []);

  const menuItems = [
    {
      title: t('dashboard'),
      href: `/${locale}/instructor/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: t('myCourses'),
      href: `/${locale}/instructor/courses`,
      icon: BookOpen,
    },
    {
      title: t('students'),
      href: `/${locale}/instructor/students`,
      icon: Users,
    },
    {
      title: t('settings'),
      href: `/${locale}/instructor/settings`,
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    await logout(locale);
  };

  // Get initials from full name or email
  const getInitials = () => {
    if (!user) return 'IN';
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
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">{t('instructorPortal')}</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('navigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === `/${locale}/instructor/dashboard`}
                >
                  <Link href={`/${locale}/instructor/dashboard`}>
                    <LayoutDashboard className="h-4 w-4" />
                    <span>{t('dashboard')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* My Courses - with submenu */}
              <Collapsible
                asChild
                defaultOpen={pathname.includes('/instructor/courses')}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={pathname.includes('/instructor/courses')}
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>{t('myCourses')}</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link href={`/${locale}/instructor/courses`}>
                            <List className="h-4 w-4" />
                            <span>{t('allCourses')}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      {pathname.includes('/manage') && (
                        <>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={`${pathname.split('?')[0]}?tab=details`}
                              >
                                <Info className="h-4 w-4" />
                                <span>{t('basicInfo')}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={`${
                                  pathname.split('?')[0]
                                }?tab=curriculum`}
                              >
                                <List className="h-4 w-4" />
                                <span>{t('curriculum')}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Students */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(
                    `/${locale}/instructor/students`
                  )}
                >
                  <Link href={`/${locale}/instructor/students`}>
                    <Users className="h-4 w-4" />
                    <span>{t('students')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Settings */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(
                    `/${locale}/instructor/settings`
                  )}
                >
                  <Link href={`/${locale}/instructor/settings`}>
                    <Settings className="h-4 w-4" />
                    <span>{t('settings')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">
              {user?.fullName || t('instructor')}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || t('loading') || 'Loading...'}
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
