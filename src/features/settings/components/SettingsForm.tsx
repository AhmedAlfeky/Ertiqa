'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormInput, FormImageUpload } from '@/app/components/form';
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from '@/features/settings/schemas';
import { updateProfile } from '@/features/settings/actions';
import type { User } from '@supabase/supabase-js';

interface SettingsFormProps {
  user: User;
  profile: any;
  locale: string;
}

export function SettingsForm({ user, profile, locale }: SettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      full_name: profile?.full_name || user.user_metadata?.full_name || '',
      bio: profile?.bio || user.user_metadata?.bio || '',
      phone: profile?.phone || user.user_metadata?.phone || '',
      specialization: profile?.specialization || user.user_metadata?.specialization || '',
      avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || '',
      linkedin_url: profile?.linkedin_url || '',
      twitter_url: profile?.twitter_url || '',
      website_url: profile?.website_url || '',
      facebook_url: profile?.facebook_url || '',
      instagram_url: profile?.instagram_url || '',
      youtube_url: profile?.youtube_url || '',
    },
  });

  const handleSubmit = async (data: UpdateProfileInput) => {
    startTransition(async () => {
      const result = await updateProfile(user.id, data, locale);

      if (result.success) {
        toast.success('Profile updated successfully');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    });
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Profile Picture */}
          <div className="bg-card p-6 rounded-lg border space-y-4">
            <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
            <FormImageUpload
              name="avatar_url"
              label="Avatar"
              description="Upload your profile picture (max 5MB)"
              bucket="avatars"
              folder="user-avatars"
              maxSizeMB={5}
            />
          </div>

          {/* Basic Information */}
          <div className="bg-card p-6 rounded-lg border space-y-4">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

            <FormInput
              name="full_name"
              label="Full Name"
              placeholder="Enter your full name"
              formType="input"
              inputType="text"
              required
              disabled={isPending}
            />

            <FormInput
              name="phone"
              label="Phone Number"
              placeholder="Enter your phone number"
              formType="phone"
              disabled={isPending}
            />

            <FormInput
              name="bio"
              label="Bio"
              placeholder="Tell us about yourself..."
              formType="textarea"
              disabled={isPending}
              rows={5}
            />
          </div>

          {/* Professional Information (for instructors) */}
          {(profile?.is_instructor || user.user_metadata?.role === 'INSTRUCTOR') && (
            <div className="bg-card p-6 rounded-lg border space-y-4">
              <h2 className="text-xl font-semibold mb-4">Professional Information</h2>

              <FormInput
                name="specialization"
                label="Specialization"
                placeholder="e.g., Web Development, Data Science, Design"
                formType="input"
                inputType="text"
                disabled={isPending}
              />
            </div>
          )}

          {/* Social Links */}
          <div className="bg-card p-6 rounded-lg border space-y-4">
            <h2 className="text-xl font-semibold mb-4">Social Links</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                name="website_url"
                label="Website"
                placeholder="https://yourwebsite.com"
                formType="input"
                inputType="url"
                disabled={isPending}
              />

              <FormInput
                name="linkedin_url"
                label="LinkedIn"
                placeholder="https://linkedin.com/in/yourprofile"
                formType="input"
                inputType="url"
                disabled={isPending}
              />

              <FormInput
                name="twitter_url"
                label="Twitter/X"
                placeholder="https://twitter.com/yourhandle"
                formType="input"
                inputType="url"
                disabled={isPending}
              />

              <FormInput
                name="facebook_url"
                label="Facebook"
                placeholder="https://facebook.com/yourprofile"
                formType="input"
                inputType="url"
                disabled={isPending}
              />

              <FormInput
                name="instagram_url"
                label="Instagram"
                placeholder="https://instagram.com/yourhandle"
                formType="input"
                inputType="url"
                disabled={isPending}
              />

              <FormInput
                name="youtube_url"
                label="YouTube"
                placeholder="https://youtube.com/@yourchannel"
                formType="input"
                inputType="url"
                disabled={isPending}
              />
            </div>
          </div>

          {/* Account Information (Read-only) */}
          <div className="bg-card p-6 rounded-lg border space-y-4">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Email
              </label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <p className="text-sm text-muted-foreground">
              Email cannot be changed. Contact support if you need to update your email.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}

