import { getContent } from '@/lib/db';
import ClientLayout from '@/components/ClientLayout';
import ProductsIndexClient from '@/components/ProductsIndexClient';

export const revalidate = 0;

export default async function ProductsPage() {
  const content = await getContent();

  return (
    <ClientLayout initialContent={content}>
      <ProductsIndexClient />
    </ClientLayout>
  );
}
