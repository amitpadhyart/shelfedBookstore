import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AddressManager } from "@/components/account/address-manager";

export const metadata = { title: "Saved addresses" };

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return <AddressManager initialAddresses={addresses} />;
}
