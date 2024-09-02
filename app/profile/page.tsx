import { Suspense } from 'react';
import ProfileForm from '@/components/ProfileForm';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileForm />
      </Suspense>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full max-w-sm" />
      <Skeleton className="h-8 w-full max-w-sm" />
      <Skeleton className="h-8 w-full max-w-sm" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-32" />
    </div>
  );
}
