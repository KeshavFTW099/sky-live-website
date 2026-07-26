import { getContent } from '@/lib/db';
import ClientLayout from '@/components/ClientLayout';
import HomeClient from '@/components/HomeClient';

// Prevent static caching of pages to ensure updates reflect instantly
// Vercel deployment test comment
export const revalidate = 0;

export default async function HomePage() {
  const content = await getContent();

  return (
    <ClientLayout initialContent={content}>
      <HomeClient />
    </ClientLayout>
  );
}
