import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import LandingNavbar from "@/components/LandingNavbar";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1920&auto=format&fit=crop";

const FACILITIES_DATA = [
  { icon: "📶", title: "WiFi Kecepatan Tinggi", desc: "Koneksi stabil hingga 100 Mbps di setiap kamar" },
  { icon: "❄️", title: "Kulkas", desc: "Tersedia kulkas personal di setiap kamar standar" },
  { icon: "🍳", title: "Dapur Bersama", desc: "Area memasak luas dengan perlengkapan lengkap" },
  { icon: "📹", title: "CCTV", desc: "Pemantauan 24 jam untuk keamanan seluruh penghuni" },
];

const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Penghuni sejak 2022",
    avatar: "SJ",
    rating: 5,
    text: '"Masalahnya cepat ditangani. AC saya rusak dan diperbaiki dalam 24 jam. Sangat rekomendasikan!"',
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Penghuni sejak 2023",
    avatar: "MC",
    rating: 5,
    text: '"Rumah kos terbaik yang pernah saya tinggali! Fasilitas lengkap dan pengelola sangat responsif."',
  },
  {
    id: 3,
    name: "Jessica Pratama",
    role: "Penghuni sejak 2015",
    avatar: "JP",
    rating: 5,
    text: '"Sangat memuaskan dengan tempatnya, dekat dengan universitas, mudah ke mana-mana."',
  },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getSession();

  // Ambil data asli dari server
  const dataKamar = await prisma.kamar.findMany({
    where: { status: "KOSONG" }, // Tampilkan yang kosong saja (tersedia untuk dipesan)
    take: 3,
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* ========== NAVBAR ========== */}
      <div className="sticky top-0 z-50">
        <LandingNavbar session={session} />
      </div>

      {/* ========== HERO SECTION ========== */}
      <section className="relative w-full h-[520px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_IMAGE_URL}
            alt="Modern Kos Room"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gray-900/55" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5 drop-shadow leading-tight">
            Temukan Hunian Modern <br /> Impianmu
          </h1>
          <p className="text-base md:text-lg text-gray-200 mb-10 max-w-xl mx-auto font-light">
            Rasakan kenyamanan di kost premium kami yang berlokasi strategis di seluruh kota. Dikelola secara profesional untuk ketenangan Anda.
          </p>
          <Link href={session ? (session.role === "ADMIN" ? "/admin" : "/dashboard") : "/register"}>
            <Button
              variant="primary"
              size="lg"
              className="shadow-xl shadow-primary/30 font-semibold px-10 rounded-full"
            >
              Cari Kamar Sekarang →
            </Button>
          </Link>
        </div>
      </section>

      {/* ========== KAMAR SECTION ========== */}
      <section id="kamar" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Kamar Tersedia untuk Anda</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dataKamar.length === 0 ? (
              <p className="col-span-3 text-center text-gray-500 py-10">Maaf, saat ini seluruh kamar sedang penuh.</p>
            ) : dataKamar.map((room) => (
              <Card
                key={room.id}
                className="flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden border border-gray-100"
              >
                {/* Room Image */}
                <div className="relative w-full h-52 group overflow-hidden bg-gray-200 flex items-center justify-center text-gray-400">
                  {room.foto_utama ? (
                    <Image
                      src={room.foto_utama}
                      alt={room.tipe}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : <span>Tanpa Foto</span>}

                  <Badge
                    variant="success"
                    className="absolute top-3 right-3 shadow text-xs font-bold tracking-wide"
                  >
                    KOSONG
                  </Badge>
                </div>

                {/* Room Info */}
                <CardBody className="flex flex-col flex-grow bg-white">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{room.tipe}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-black text-gray-900">Rp {room.harga_per_bulan.toLocaleString('id-ID')}</span>
                    <span className="text-sm text-gray-500 font-normal">/bulan</span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700 font-medium mb-6 flex-grow">
                    {room.fasilitas.split(",").map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-primary text-base">✓</span>
                        {feature.trim()}
                      </li>
                    ))}
                  </ul>

                  <Link href={session ? "/dashboard" : "/register"} className="w-full inline-block">
                    <Button variant="primary" className="w-full py-2.5 text-sm font-semibold rounded-lg text-center font-bold">
                      Pesan Sekarang
                    </Button>
                  </Link>

                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FASILITAS UNGGULAN ========== */}
      <section id="fasilitas" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10">Fasilitas Unggulan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FACILITIES_DATA.map((facility, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow border border-slate-100"
              >
                <div className="text-4xl mb-4">{facility.icon}</div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{facility.title}</h3>
                <p className="text-xs text-gray-500 font-normal leading-relaxed">{facility.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== LOKASI STRATEGIS ========== */}
      <section id="lokasi" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Lokasi Strategis <br /> di Pusat Kota
              </h2>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Rumah kos kami berlokasi strategis, dekat dengan universitas ternama dan delapan pusat perbelanjaan. Nikmati kemudahan transportasi umum dan akses ke fasilitas kota.
              </p>
              <ul className="space-y-3 text-sm text-gray-700 font-medium mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">📍</span>
                  Dekat Universitas Teknologi (6 menit jalan kaki)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">📍</span>
                  Pusat Perbelanjaan Depok (10 menit naik ojol)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">📍</span>
                  Pita Perhubungan Kota (15 menit jalan kaki)
                </li>
              </ul>
              <Button variant="secondary" className="border border-gray-300 text-gray-800 hover:bg-gray-100 font-semibold">
                Jelajahi Lokasi →
              </Button>
            </div>

            {/* Map Dummy */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg h-80 bg-gray-100 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-slate-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-5 flex flex-col items-center gap-2 border border-gray-100">
                  <span className="text-4xl">📍</span>
                  <p className="font-bold text-gray-900 text-sm">SmartKos Residence</p>
                  <p className="text-xs text-gray-500">5 Lokasi Tersedia</p>
                  <Badge variant="success" className="mt-1">Peta Interaktif</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONI ========== */}
      <section id="tentang" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">
            Apa Kata Penghuni Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS_DATA.map((t) => (
              <Card key={t.id} className="rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <CardBody>
                  <div className="flex gap-0.5 text-yellow-400 text-sm mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">{t.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">S</div>
                <span className="font-bold text-white text-lg">SmartKos</span>
              </div>
              <p className="text-sm leading-relaxed">
                Temukan hunian terbaik yang nyaman, aman, dan terjangkau bersama kami.
              </p>
            </div>

            {/* Perusahaan */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Karir</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontak</a></li>
              </ul>
            </div>

            {/* Bantuan */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Bantuan</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Pusat Bantuan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Syarat &amp; Kebijakan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Helpdesk Fraud</a></li>
              </ul>
            </div>

            {/* Media Sosial */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Media Sosial</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-600">
            © 2024 SmartKos. Hak Cipta dilindungi undang-undang.
          </div>
        </div>
      </footer>
    </div>
  );
}
