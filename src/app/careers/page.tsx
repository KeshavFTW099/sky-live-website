import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import ClientLayout from '@/components/ClientLayout';
import CareersClient from '@/components/CareersClient';

export const revalidate = 0;

export default async function CareersPage() {
  await dbConnect();

  const contentDoc = await Content.findOne({});
  const content = contentDoc ? JSON.parse(JSON.stringify(contentDoc)) : null;

  return (
    <ClientLayout initialContent={content}>
      <CareersClient />
    </ClientLayout>
  );
}
