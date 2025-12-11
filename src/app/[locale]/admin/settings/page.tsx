import { redirect } from 'next/navigation';
import { SettingsForm } from '@/features/settings/components/SettingsForm';
import { isAdmin } from '@/features/admin/queries';
import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  const supabase = await createClient();
  
  const userIsAdmin = await isAdmin();
  
  if (!userIsAdmin) {
    redirect(`/${locale}/login`);
  }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile and account settings
        </p>
      </div>

      <SettingsForm 
        user={user} 
        profile={profile} 
        locale={locale}
      />
    </div>
  );
}





