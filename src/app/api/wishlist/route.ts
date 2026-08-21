import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { WishlistBook } from "@/store/wishlist-store";

function toWishlistBook(item: { book: { id: string; slug: string; title: string; author: string; price: number; coverUrl: string } }): WishlistBook {
  return {
    bookId: item.book.id,
    slug: item.book.slug,
    title: item.book.title,
    author: item.book.author,
    price: item.book.price,
    coverUrl: item.book.coverUrl,
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ items: [] });

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { book: true },
  });
  return NextResponse.json({ items: items.map(toWishlistBook) });
}

/** Merges locally-saved bookIds into the DB wishlist (used right after sign-in). */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ items: [] });

  const body = await req.json();
  const bookIds: string[] = Array.isArray(body?.bookIds) ? body.bookIds : [];

  for (const bookId of bookIds) {
    await prisma.wishlistItem.upsert({
      where: { userId_bookId: { userId: session.user.id, bookId } },
      update: {},
      create: { userId: session.user.id, bookId },
    });
  }

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { book: true },
  });
  return NextResponse.json({ items: items.map(toWishlistBook) });
}

/** Toggles a single book on/off the wishlist. */
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { bookId } = await req.json();
  if (!bookId) return NextResponse.json({ error: "bookId is required." }, { status: 400 });

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_bookId: { userId: session.user.id, bookId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await prisma.wishlistItem.create({ data: { userId: session.user.id, bookId } });
  return NextResponse.json({ saved: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId");
  if (!bookId) return NextResponse.json({ error: "bookId is required." }, { status: 400 });

  await prisma.wishlistItem.deleteMany({ where: { userId: session.user.id, bookId } });
  return NextResponse.json({ ok: true });
}
