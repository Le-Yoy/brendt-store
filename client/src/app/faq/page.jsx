'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '../../components/layout';
import FAQPage from '../../components/faq/FAQPage';

function FAQContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  
  return <FAQPage initialCategory={category} />;
}

export default function FAQ() {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <FAQContent />
      </Suspense>
    </Layout>
  );
}
