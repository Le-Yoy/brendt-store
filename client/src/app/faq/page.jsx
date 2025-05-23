'use client';

import { useSearchParams } from 'next/navigation';
import Layout from '../../components/layout';
import FAQPage from '../../components/faq/FAQPage';

export default function FAQ() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  
  return (
    <Layout>
      <FAQPage initialCategory={category} />
    </Layout>
  );
}