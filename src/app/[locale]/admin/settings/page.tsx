import { redirect } from 'next/navigation';
import { SettingsForm } from '@/features/settings/components/SettingsForm';
import { isAdmin } from '@/features/admin/queries';
import { createClient } from '@/lib/supabase/server';

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
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





