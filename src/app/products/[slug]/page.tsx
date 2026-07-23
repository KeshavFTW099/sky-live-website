import { getContent } from '@/lib/db';
import ClientLayout from '@/components/ClientLayout';
import DynamicProductClient from '@/components/DynamicProductClient';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DynamicProductPage({ params }: PageProps) {
  const { slug } = await params;

  const content = await getContent();

  return (
    <ClientLayout initialContent={content}>
      <DynamicProductClient slug={slug} />
    </ClientLayout>
  );
}
