import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import ClientLayout from '@/components/ClientLayout';
import DynamicProductClient from '@/components/DynamicProductClient';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DynamicProductPage({ params }: PageProps) {
  const { slug } = await params;

  await dbConnect();
  const contentDoc = await Content.findOne({});
  const content = contentDoc ? JSON.parse(JSON.stringify(contentDoc)) : null;

  return (
    <ClientLayout initialContent={content}>
      <DynamicProductClient slug={slug} />
    </ClientLayout>
  );
}
