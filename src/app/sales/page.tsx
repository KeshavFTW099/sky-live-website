import { getContent } from '@/lib/db';
import ClientLayout from '@/components/ClientLayout';
import WhatWeDoClient from '@/components/WhatWeDoClient';

export const revalidate = 0;

export default async function SalesPage() {
  const content = await getContent();

  return (
    <ClientLayout initialContent={content}>
      <WhatWeDoClient />
    </ClientLayout>
  );
}
