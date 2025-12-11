import { redirect } from 'next/navigation';
import { SettingsForm } from '@/features/settings/components/SettingsForm';
import { createClient } from '@/lib/supabase/server';
import MaxWidthWrapper from '@/app/components/MaxwidthWrapper';

export default async function InstructorSettingsPage({
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
    <MaxWidthWrapper>
      <div className="space-y-6">
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
    </MaxWidthWrapper>
  );
}





