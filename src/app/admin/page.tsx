import { getContent } from '@/lib/db';
import AdminClient from '@/components/AdminClient';

export const revalidate = 0;

export default async function AdminPage() {
  const content = await getContent();

  return <AdminClient initialContent={content} />;
}
