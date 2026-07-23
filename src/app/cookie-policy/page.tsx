import { getContent } from '@/lib/db';
import ClientLayout from '@/components/ClientLayout';
import LegalPageClient from '@/components/LegalPageClient';

export const revalidate = 0;

export default async function CookiePolicyPage() {
  const content = await getContent();

  return (
    <ClientLayout initialContent={content}>
      <LegalPageClient policyKey="cookie-policy" />
    </ClientLayout>
  );
}
