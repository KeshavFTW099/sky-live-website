import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import ClientLayout from '@/components/ClientLayout';
import HomeClient from '@/components/HomeClient';

// Prevent static caching of pages to ensure updates reflect instantly
export const revalidate = 0;

export default async function HomePage() {
  await dbConnect();
  
  // Retrieve CMS Content from MongoDB Atlas
  const contentDoc = await Content.findOne({});
  const content = contentDoc ? JSON.parse(JSON.stringify(contentDoc)) : null;

  return (
    <ClientLayout initialContent={content}>
      <HomeClient />
    </ClientLayout>
  );
}
