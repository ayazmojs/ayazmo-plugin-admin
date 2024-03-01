import React from 'react';
import BreadCrumb from "ayazmo-plugin-admin/components/breadcrumb";
import { AdminClient } from 'ayazmo-plugin-admin/components/admin/table/client';
import { get } from "ayazmo-plugin-admin/lib/http-wrapper";

export default async function page() {
  const admins = await get('/admin/admins');

  const breadcrumbItems = [{ title: `Admins (${admins.length})`, link: "/dashboard/admins" }];

  return (
    <>
      <div className="flex-1 space-y-4 p-4">
        <BreadCrumb items={breadcrumbItems} />
        <AdminClient data={admins} />
      </div>
    </>
  );
}