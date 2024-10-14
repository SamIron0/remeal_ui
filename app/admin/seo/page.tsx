'use client'
import React from 'react';
import SEOForm from '@/components/admin/SEOForm';

export default function AdminSEO() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">SEO Page Metadata Generator</h1>
      <SEOForm />
    </div>
  );
}
