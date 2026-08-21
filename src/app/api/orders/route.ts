import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";
import { generateOrderNumber } from "@/lib/utils";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const orderItemSchema = z.object({
  bookId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().int().positive(),
  title: z.string(),
});

const createOrderSchema = checkoutSchema.extend({
  items: z.array(orderItemSchema).min(1, "Your cart is empty."),
  subtotal: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid order." }, { status: 400 });
    }

    const { items, subtotal, total, ...delivery } = parsed.data;

    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Validate stock before touching anything.
      for (const item of items) {
        const book = await tx.book.findUnique({ where: { id: item.bookId } });
        if (!book) throw new Error("One of the books in your cart is no longer available.");
        if (book.stock < item.quantity) {
          throw new Error(`Only ${book.stock} left of "${book.title}" — please adjust your cart.`);
        }
      }

      for (const item of items) {
        await tx.book.update({
          where: { id: item.bookId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      let orderNumber = generateOrderNumber();
      for (let attempts = 0; attempts < 5; attempts++) {
        const existing = await tx.order.findUnique({ where: { orderNumber } });
        if (!existing) break;
        orderNumber = generateOrderNumber();
      }

      return tx.order.create({
        data: {
          orderNumber,
          userId: session?.user?.id,
          guestName: delivery.fullName,
          guestPhone: delivery.phone,
          guestLine1: delivery.line1,
          guestLine2: delivery.line2,
          guestCity: delivery.city,
          guestState: delivery.state,
          guestPincode: delivery.pincode,
          subtotal,
          total,
          status: "PENDING_PAYMENT",
          items: {
            create: items.map((item) => ({
              bookId: item.bookId,
              quantity: item.quantity,
              price: item.price,
              title: item.title,
            })),
          },
        },
      });
    });

    // Order exists now — safe to clear a logged-in user's server-side cart.
    if (session?.user) {
      await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    const message = error instanceof Error ? error.message : "Couldn't place that order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ orders: [] });

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}
