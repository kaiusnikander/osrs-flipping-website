import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const items = [
  { id: 4151, name: "Abyssal whip", buyPrice: 2400000, sellPrice: 2435000, volume: 1842 },
  { id: 11840, name: "Dragon boots", buyPrice: 182000, sellPrice: 185500, volume: 6321 },
  { id: 1127, name: "Rune platebody", buyPrice: 38400, sellPrice: 39800, volume: 9044 },
  { id: 2363, name: "Runite bar", buyPrice: 11600, sellPrice: 12100, volume: 12870 },
  { id: 1215, name: "Dragon dagger", buyPrice: 18200, sellPrice: 19500, volume: 5210 },
];

async function main() {
  for (const item of items) {
    await prisma.item.upsert({ where: { id: item.id }, update: item, create: item });
  }
}

main().finally(() => prisma.$disconnect());
