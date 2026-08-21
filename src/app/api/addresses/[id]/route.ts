import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/validations";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const address = await prisma.address.findUnique({ where: { id: params.id } });
  if (!address || address.userId !== session.user.id) {
    return NextResponse.json({ error: "Address not found." }, { status: 404 });
  }

  const body = await req.json();
  const parsed = addressSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid address." }, { status: 400 });
  }

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } });
  }

  const updated = await prisma.address.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json({ address: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const address = await prisma.address.findUnique({ where: { id: params.id } });
  if (!address || address.userId !== session.user.id) {
    return NextResponse.json({ error: "Address not found." }, { status: 404 });
  }

  await prisma.address.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
