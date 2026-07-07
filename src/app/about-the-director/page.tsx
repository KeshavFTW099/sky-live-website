import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import ClientLayout from '@/components/ClientLayout';
import AboutDirectorClient from '@/components/AboutDirectorClient';

export const revalidate = 0;

export default async function AboutDirectorPage() {
  await dbConnect();

  const contentDoc = await Content.findOne({});
  const content = contentDoc ? JSON.parse(JSON.stringify(contentDoc)) : null;

  return (
    <ClientLayout initialContent={content}>
      <AboutDirectorClient />
    </ClientLayout>
  );
}
