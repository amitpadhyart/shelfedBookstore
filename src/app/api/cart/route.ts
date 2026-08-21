import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { CartLine } from "@/store/cart-store";

function toCartLine(item: { quantity: number; book: { id: string; slug: string; title: string; author: string; price: number; coverUrl: string; format: string; stock: number } }): CartLine {
  return {
    bookId: item.book.id,
    slug: item.book.slug,
    title: item.book.title,
    author: item.book.author,
    price: item.book.price,
    coverUrl: item.book.coverUrl,
    format: item.book.format,
    stock: item.book.stock,
    quantity: item.quantity,
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ items: [] });

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { book: true },
  });

  return NextResponse.json({ items: cartItems.map(toCartLine) });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ items: [] });

  const body = await req.json();
  const localItems: { bookId: string; quantity: number }[] = Array.isArray(body?.items) ? body.items : [];

  const existing = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
  });
  const existingMap = new Map(existing.map((i) => [i.bookId, i.quantity]));

  for (const local of localItems) {
    const merged = Math.max(existingMap.get(local.bookId) ?? 0, local.quantity);
    await prisma.cartItem.upsert({
      where: { userId_bookId: { userId: session.user.id, bookId: local.bookId } },
      update: { quantity: merged },
      create: { userId: session.user.id, bookId: local.bookId, quantity: merged },
    });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { book: true },
  });

  return NextResponse.json({ items: cartItems.map(toCartLine) });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { bookId, quantity } = await req.json();
  if (!bookId || typeof quantity !== "number") {
    return NextResponse.json({ error: "bookId and quantity are required." }, { status: 400 });
  }

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({ where: { userId: session.user.id, bookId } });
    return NextResponse.json({ ok: true });
  }

  await prisma.cartItem.upsert({
    where: { userId_bookId: { userId: session.user.id, bookId } },
    update: { quantity },
    create: { userId: session.user.id, bookId, quantity },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId");
  if (!bookId) return NextResponse.json({ error: "bookId is required." }, { status: 400 });

  await prisma.cartItem.deleteMany({ where: { userId: session.user.id, bookId } });
  return NextResponse.json({ ok: true });
}
