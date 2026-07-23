import { getContent } from '@/lib/db';
import ClientLayout from '@/components/ClientLayout';
import ServicesClient from '@/components/ServicesClient';

export const revalidate = 0;

export default async function ServicesPage() {
  const content = await getContent();

  return (
    <ClientLayout initialContent={content}>
      <ServicesClient />
    </ClientLayout>
  );
}
