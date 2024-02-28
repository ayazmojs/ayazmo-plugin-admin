import Header from "ayazmo-plugin-admin/components/layout/header";
import Sidebar from "ayazmo-plugin-admin/components/layout/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next Shadcn Dashboard Starter",
  description: "Basic dashboard with Next.js and Shadcn",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="w-full p-1 pt-16">{children}</main>
      </div>
    </>
  );
}