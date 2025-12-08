import { redirect } from 'next/navigation';
import { SettingsForm } from '@/features/settings/components/SettingsForm';
import { createClient } from '@/lib/supabase/server';

export default async function StudentSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  
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
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
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





