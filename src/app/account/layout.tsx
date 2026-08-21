import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AccountNav } from "@/components/account/account-nav";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="container py-10 md:py-14">
      <p className="section-label">Your account</p>
      <h1 className="font-display text-display-lg mt-2 mb-10 text-ink dark:text-paper-soft">
        {session?.user?.name ? `Hello, ${session.user.name.split(" ")[0]}` : "Your account"}
      </h1>

      <div className="grid md:grid-cols-[200px_1fr] gap-10">
        <AccountNav isAdmin={session?.user?.role === "ADMIN"} />
        <div>{children}</div>
      </div>
    </div>
  );
}
