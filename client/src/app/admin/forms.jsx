"use client";

import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import FormList from '../../components/admin/FormList';

export default function AdminFormsPage() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    async function fetchForms() {
      try {
        const res = await adminService.getForms();
        setForms(res.data.forms);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    }
    fetchForms();
  }, []);

  return (
    <div className="admin-forms p-6">
      <h1 className="text-3xl font-bold mb-4">Form Submissions</h1>
      <FormList forms={forms} />
    </div>
  );
}
