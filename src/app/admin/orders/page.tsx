import { prisma } from "@/lib/prisma";
import { formatDate, formatINR } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import type { OrderItem } from "@prisma/client";

export const metadata = { title: "Manage orders" };

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true, user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <p className="font-body text-sm text-ink-soft dark:text-paper-soft/60 mb-6">{orders.length} orders total</p>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="leaf rounded-sm p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-sm text-ink dark:text-paper-soft">{order.orderNumber}</p>
                <p className="font-body text-sm text-ink-soft dark:text-paper-soft/70 mt-0.5">
                  {order.user?.name || order.guestName} · {order.user?.email || order.guestPhone}
                </p>
                <p className="font-mono text-xs text-ink-faint dark:text-paper-soft/40 mt-0.5">{formatDate(order.createdAt)}</p>
              </div>
              <OrderStatusSelect orderId={order.id} status={order.status} />
            </div>

            <ul className="mt-3 font-body text-sm text-ink-soft dark:text-paper-soft/70 space-y-0.5">
              {order.items.map((item: OrderItem) => (
                <li key={item.id}>
                  {item.title} × {item.quantity}
                </li>
              ))}
            </ul>

            <div className="mt-3 pt-3 rule flex items-center justify-between">
              <p className="font-body text-xs text-ink-faint dark:text-paper-soft/40">
                {order.guestLine1}, {order.guestCity}, {order.guestState} {order.guestPincode}
              </p>
              <span className="font-mono text-sm text-brass-dark dark:text-brass-light">{formatINR(order.total)}</span>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="font-body text-sm text-ink-soft dark:text-paper-soft/60">No orders placed yet.</p>
        )}
      </div>
    </div>
  );
}
