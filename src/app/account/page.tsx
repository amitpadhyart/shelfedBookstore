import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { formatDate, formatINR } from "@/lib/utils";
import { LinkButton } from "@/components/ui/link-button";
import { PackageOpen } from "lucide-react";
import type { OrderItem } from "@prisma/client";

export const metadata = { title: "Order history" };

export default async function AccountOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div className="py-10 text-center leaf rounded-sm">
        <PackageOpen className="mx-auto h-8 w-8 text-ink-faint dark:text-paper-soft/30" aria-hidden="true" />
        <p className="mt-4 font-display text-lg text-ink dark:text-paper-soft">No orders yet.</p>
        <p className="mt-1 font-body text-sm text-ink-soft dark:text-paper-soft/60">
          Once you check out, your orders will show up here.
        </p>
        <LinkButton href="/catalog" className="mt-5" size="sm">
          Browse the catalog
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="leaf rounded-sm p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-mono text-sm text-ink dark:text-paper-soft">{order.orderNumber}</p>
              <p className="font-mono text-xs text-ink-faint dark:text-paper-soft/40">{formatDate(order.createdAt)}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <ul className="mt-4 space-y-1 font-body text-sm text-ink-soft dark:text-paper-soft/70">
            {order.items.map((item: OrderItem) => (
              <li key={item.id}>
                {item.title} × {item.quantity}
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-3 rule flex justify-between items-center">
            <span className="font-mono text-xs text-ink-faint dark:text-paper-soft/40">
              {order.items.reduce((n: number, i: OrderItem) => n + i.quantity, 0)} items
            </span>
            <span className="font-mono text-sm text-brass-dark dark:text-brass-light">{formatINR(order.total)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
