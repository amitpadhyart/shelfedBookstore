import { PrismaClient, Format } from "@prisma/client";
import bcrypt from "bcryptjs";
import books from "../data/books.json";

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding ${books.length} books...`);

  for (const book of books) {
    await prisma.book.upsert({
      where: { slug: book.slug },
      update: {
        title: book.title,
        author: book.author,
        genre: book.genre,
        price: book.price,
        coverUrl: book.coverUrl,
        synopsis: book.synopsis,
        authorBio: book.authorBio,
        rating: book.rating,
        ratingCount: book.ratingCount,
        stock: book.stock,
        format: book.format as Format,
        year: book.year,
        featured: book.featured,
        staffPick: book.staffPick,
        staffNote: book.staffNote,
        newArrival: book.newArrival,
        mood: book.mood,
      },
      create: {
        slug: book.slug,
        title: book.title,
        author: book.author,
        isbn:  String(book.isbn),
        genre: book.genre,
        price: book.price,
        coverUrl: book.coverUrl,
        synopsis: book.synopsis,
        authorBio: book.authorBio,
        rating: book.rating,
        ratingCount: book.ratingCount,
        stock: book.stock,
        format: book.format as Format,
        year: book.year,
        featured: book.featured,
        staffPick: book.staffPick,
        staffNote: book.staffNote,
        newArrival: book.newArrival,
        mood: book.mood,
      },
    });
  }

  // Demo admin account — change this password after first login in production.
  const adminPassword = await bcrypt.hash("shelfed-admin-2026", 10);
  await prisma.user.upsert({
    where: { email: "admin@shelfed.store" },
    update: {},
    create: {
      name: "Shelfed Admin",
      email: "admin@shelfed.store",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Demo customer account for testing checkout/order history.
  const customerPassword = await bcrypt.hash("readingtime", 10);
  await prisma.user.upsert({
    where: { email: "reader@shelfed.store" },
    update: {},
    create: {
      name: "Demo Reader",
      email: "reader@shelfed.store",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });

  console.log("Seed complete.");
  console.log("  Admin login:    admin@shelfed.store / shelfed-admin-2026");
  console.log("  Customer login: reader@shelfed.store / readingtime");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
