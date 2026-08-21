import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";
import { bookSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Admins only." }, { status: 403 });

  const body = await req.json();
  const parsed = bookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid book." }, { status: 400 });
  }

  const baseSlug = slugify(parsed.data.title);
  let slug = baseSlug;
  let n = 1;
  while (await prisma.book.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++n}`;
  }

  const book = await prisma.book.create({ data: { ...parsed.data, slug } });
  return NextResponse.json({ book }, { status: 201 });
}
