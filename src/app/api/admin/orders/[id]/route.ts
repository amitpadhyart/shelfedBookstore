import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["PENDING_PAYMENT", "PAYMENT_CONFIRMED", "FULFILLED", "CANCELLED"]),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Admins only." }, { status: 403 });

  const body = await req.json();
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const order = await prisma.order.update({ where: { id: params.id }, data: { status: parsed.data.status } });
  return NextResponse.json({ order });
}
