import { PrismaClient } from "@generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

async function main() {
    const connectionString = process.env.DATABASE_URL!;
    const pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    console.log("Memulai proses seeding...");

    // Tambahkan 3 kamar dummy
    const kamar1 = await prisma.kamar.create({
        data: {
            nomor_kamar: "101",
            tipe: "Standard Single",
            harga_per_bulan: 1500000,
            fasilitas: "Single Bed, WiFi, Kamar Mandi Luar",
            status: "KOSONG",
            foto_utama: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=200&auto=format&fit=crop",
        },
    });

    const kamar2 = await prisma.kamar.create({
        data: {
            nomor_kamar: "102",
            tipe: "Deluxe Queen",
            harga_per_bulan: 2200000,
            fasilitas: "Queen Bed, AC, WiFi, Kamar Mandi Dalam",
            status: "KOSONG",
            foto_utama: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=200&auto=format&fit=crop",
        },
    });

    const kamar3 = await prisma.kamar.create({
        data: {
            nomor_kamar: "103",
            tipe: "Executive Suite",
            harga_per_bulan: 3500000,
            fasilitas: "King Bed, AC, WiFi, Balkon, Dapur Kecil",
            status: "KOSONG",
            foto_utama: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=200&auto=format&fit=crop",
        },
    });

    console.log("Seeding selesai!");
    console.log({ kamar1, kamar2, kamar3 });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
