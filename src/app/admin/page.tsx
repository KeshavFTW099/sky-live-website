import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import AdminClient from '@/components/AdminClient';

export const revalidate = 0;

export default async function AdminPage() {
  await dbConnect();
  
  const contentDoc = await Content.findOne({});
  const content = contentDoc ? JSON.parse(JSON.stringify(contentDoc)) : null;

  return <AdminClient initialContent={content} />;
}
