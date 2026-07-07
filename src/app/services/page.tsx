import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import ClientLayout from '@/components/ClientLayout';
import ServicesClient from '@/components/ServicesClient';

export const revalidate = 0;

export default async function ServicesPage() {
  await dbConnect();

  const contentDoc = await Content.findOne({});
  const content = contentDoc ? JSON.parse(JSON.stringify(contentDoc)) : null;

  return (
    <ClientLayout initialContent={content}>
      <ServicesClient />
    </ClientLayout>
  );
}
