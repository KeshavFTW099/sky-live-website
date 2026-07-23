import { getContent } from '@/lib/db';
import ClientLayout from '@/components/ClientLayout';
import AboutDirectorClient from '@/components/AboutDirectorClient';

export const revalidate = 0;

export default async function AboutDirectorPage() {
  const content = await getContent();

  return (
    <ClientLayout initialContent={content}>
      <AboutDirectorClient />
    </ClientLayout>
  );
}
