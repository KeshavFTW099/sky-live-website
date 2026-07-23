import { getContent } from '@/lib/db';
import ClientLayout from '@/components/ClientLayout';
import CareersClient from '@/components/CareersClient';

export const revalidate = 0;

export default async function CareersPage() {
  const content = await getContent();

  return (
    <ClientLayout initialContent={content}>
      <CareersClient />
    </ClientLayout>
  );
}
