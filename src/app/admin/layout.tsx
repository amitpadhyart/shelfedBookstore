import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-10 md:py-14">
      <p className="section-label text-wine dark:text-wine-light">Admin</p>
      <h1 className="font-display text-display-lg mt-2 mb-10 text-ink dark:text-paper-soft">The back room</h1>

      <div className="grid md:grid-cols-[200px_1fr] gap-10">
        <AdminNav />
        <div>{children}</div>
      </div>
    </div>
  );
}
