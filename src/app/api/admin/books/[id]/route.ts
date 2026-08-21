import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";
import { bookSchema } from "@/lib/validations";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Admins only." }, { status: 403 });

  const body = await req.json();
  const parsed = bookSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid book." }, { status: 400 });
  }

  const book = await prisma.book.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json({ book });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Admins only." }, { status: 403 });

  await prisma.book.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
