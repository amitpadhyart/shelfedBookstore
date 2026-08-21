import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validations";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Log in to leave a review." }, { status: 401 });

  const body = await req.json();
  const parsed = reviewSchema.safeParse({ ...body, bookId: params.id });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid review." }, { status: 400 });
  }

  const { rating, comment } = parsed.data;

  const review = await prisma.review.upsert({
    where: { bookId_userId: { bookId: params.id, userId: session.user.id } },
    update: { rating, comment },
    create: { bookId: params.id, userId: session.user.id, rating, comment },
  });

  // Recompute the book's aggregate rating.
  const agg = await prisma.review.aggregate({
    where: { bookId: params.id },
    _avg: { rating: true },
    _count: true,
  });
  await prisma.book.update({
    where: { id: params.id },
    data: {
      rating: agg._avg.rating ?? 0,
      ratingCount: agg._count,
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}
