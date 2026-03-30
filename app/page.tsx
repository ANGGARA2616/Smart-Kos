import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import LandingNavbar from "@/components/LandingNavbar";
import HeroSlider from "@/components/HeroSlider";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1920&auto=format&fit=crop";

const FACILITIES_DATA = [
  { 
    icon: "wifi_password", 
    title: "WiFi (100 Mbps)", 
    desc: "Koneksi internet ultra-cepat untuk bekerja dari rumah tanpa hambatan." 
  },
  { 
    icon: "kitchen", 
    title: "Kulkas di Kamar", 
    desc: "Kulkas pribadi di setiap kamar untuk kenyamanan penyimpanan makanan Anda." 
  },
  { 
    icon: "restaurant", 
    title: "Dapur Bersama", 
    desc: "Dapur bersama yang luas dan lengkap dengan peralatan masak modern." 
  },
  { 
    icon: "videocam", 
    title: "24h CCTV", 
    desc: "Sistem keamanan terpantau 24 jam menjamin ketenangan istirahat Anda." 
  },
];

const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Penghuni - 1 Tahun",
    avatar: "SJ",
    rating: 5,
    text: '"Desain kamarnya sangat modern dan fungsional. WiFi-nya luar biasa kencang, sangat membantu untuk pekerjaan remote saya. Pelayanan admin juga sangat responsif."',
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Penghuni - 6 Bulan",
    avatar: "MC",
    rating: 5,
    text: '"Keamanan adalah prioritas saya, dan SmartKos memberikan ketenangan pikiran dengan sistem CCTV dan penjagaan 24 jam. Sangat direkomendasikan untuk mahasiswa!"',
  },
  {
    id: 3,
    name: "Jessica Pratama",
    role: "Penghuni - 2 Tahun",
    avatar: "JP",
    rating: 5,
    text: '"Sudah pindah-pindah kost 3 kali, dan ini yang paling terbaik. Kebersihan dapur bersama selalu terjaga, dan suasananya sangat homey tapi tetap eksklusif."',
  },
];

const ROOM_FEATURES_ICONS: Record<string, string> = {
  "ac": "ac_unit",
  "wifi": "wifi",
  "kamar mandi": "bathroom",
  "kasur": "bed",
  "lemari": "dresser",
  "meja": "desk",
  "tv": "tv",
  "balkon": "balcony",
  "dapur": "cooking",
  "kulkas": "kitchen",
};

function getFeatureIcon(feature: string): string {
  const lower = feature.toLowerCase().trim();
  for (const [key, icon] of Object.entries(ROOM_FEATURES_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "check_circle";
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getSession();

  let kostProfile = await prisma.kostProfile.findFirst();
  if (!kostProfile) {
    kostProfile = {
      id: 'default',
      nama_kost: "SmartKos Exclusive",
      deskripsi: "Kost premium khusus karyawan dan mahasiswa dengan fasilitas bintang 5 dan keamanan 24 jam.",
      nomor_kontak: "081234567890",
      alamat: "Jl. Mawar No. 123, SCBD, Jakarta Selatan. 12190",
      hero_title: "Temukan Kost\nModern Impianmu",
      foto_hero: null,
      hero_images: [],
      link_gmaps: null,
      nama_bank: "BCA",
      nomor_rekening: "1234567890",
      nama_pemilik_rekening: "PT SmartKos",
      foto_qris: null,
      logo_url: null,
      updatedAt: new Date()
    };
  }

  const dataKamar = await prisma.kamar.findMany({
    where: { status: "KOSONG" },
    take: 3,
    orderBy: { createdAt: "desc" }
  });

  const heroTitle = kostProfile.hero_title.replace(/\\n/g, "\n");

  return (
    <div className="min-h-screen bg-surface flex flex-col" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* ========== NAVBAR ========== */}
      <LandingNavbar session={session} namaKost={kostProfile.nama_kost} logoUrl={kostProfile.logo_url} />

      {/* ========== HERO SECTION ========== */}
      <section className="relative w-full min-h-[85vh] md:min-h-screen flex items-center overflow-hidden">
        <HeroSlider 
          images={kostProfile.hero_images && kostProfile.hero_images.length > 0 ? kostProfile.hero_images : (kostProfile.foto_hero ? [kostProfile.foto_hero] : [])} 
          fallbackImage={HERO_IMAGE_URL} 
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-16 md:py-24">
          <div className="space-y-5 md:space-y-8 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <span className="material-symbols-outlined text-xs md:text-sm text-white" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-white">{kostProfile.nama_kost}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight whitespace-pre-line drop-shadow-lg">
              {heroTitle.split('\n').map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line.includes('Modern') ? (
                    <>
                      {line.split('Modern')[0]}
                      <span className="italic text-primary-container">Modern</span>
                      {line.split('Modern')[1]}
                    </>
                  ) : line}
                </span>
              ))}
            </h1>

            {/* Description */}
            <p className="text-sm md:text-base lg:text-lg text-white/80 max-w-lg leading-relaxed animate-fade-in-up-delay-1">
              {kostProfile.deskripsi}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2 animate-fade-in-up-delay-2">
              <Link href={session ? (session.role === "ADMIN" ? "/admin" : "/dashboard") : "/register"}>
                <button className="px-5 py-3 md:px-8 md:py-4 bg-primary text-white text-sm md:text-base font-bold rounded-xl flex items-center gap-2 group hover:bg-primary-dim transition-all shadow-xl shadow-primary/30 active:scale-95">
                  Cari Kamar Sekarang
                  <span className="material-symbols-outlined text-[20px] md:text-[24px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </Link>
              <a href="#kamar">
                <button className="px-5 py-3 md:px-8 md:py-4 border border-white/30 text-white text-sm md:text-base font-bold rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all active:scale-95">
                  Lihat Kamar
                </button>
              </a>
            </div>
          </div>

          {/* Hero Right Stats - Floating Cards */}
          <div className="hidden lg:flex flex-col items-end gap-6 animate-fade-in-up-delay-3">
            <div className="glass-card rounded-2xl p-6 premium-shadow animate-float">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined">shield_with_heart</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Keamanan</p>
                  <p className="text-sm font-extrabold text-on-surface">24/7 Terjamin</p>
                </div>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6 premium-shadow animate-float-delay mr-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined">wifi</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Internet</p>
                  <p className="text-sm font-extrabold text-on-surface">100 Mbps</p>
                </div>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6 premium-shadow animate-float">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined">star</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Rating</p>
                  <p className="text-sm font-extrabold text-on-surface">4.9/5 ★</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-container/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* ========== KAMAR SECTION ========== */}
      <section id="kamar" className="py-14 md:py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-4 md:gap-6">
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-on-surface mb-2 md:mb-4">Ruang Hidup Terkurasi</h2>
              <p className="text-on-surface-variant text-base lg:text-lg leading-relaxed">
                Setiap kamar dirancang secara ergonomis untuk menyeimbangkan produktivitas dan kenyamanan beristirahat Anda.
              </p>
            </div>
            <Link href={session ? "/dashboard" : "/register"} className="text-primary font-bold flex items-center gap-2 group whitespace-nowrap">
              Lihat Semua Kamar
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">east</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {dataKamar.length === 0 ? (
              <div className="col-span-3 text-center py-16">
                <div className="w-20 h-20 bg-surface-container-high rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant">hotel</span>
                </div>
                <p className="text-on-surface-variant text-lg font-medium">Maaf, saat ini seluruh kamar sedang penuh.</p>
                <p className="text-on-surface-variant/60 text-sm mt-2">Silakan hubungi kami untuk informasi lebih lanjut.</p>
              </div>
            ) : dataKamar.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-[1.5rem] overflow-hidden premium-shadow group hover:-translate-y-2 transition-all duration-500 border border-gray-100/50"
              >
                {/* Room Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-container-high">
                  {room.foto_utama ? (
                    <Image
                      src={room.foto_utama}
                      alt={room.tipe}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">image</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-primary/90 backdrop-blur-sm text-white text-xs font-bold rounded-full shadow-lg">
                    Tersedia
                  </div>
                </div>

                {/* Room Info */}
                <div className="p-5 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-on-surface mb-1 md:mb-2">{room.tipe}</h3>
                  <div className="flex items-baseline gap-1 mb-4 md:mb-6">
                    <span className="text-primary text-lg md:text-xl font-extrabold">Rp {room.harga_per_bulan.toLocaleString('id-ID')}</span>
                    <span className="text-on-surface-variant text-sm">/bulan</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-2 md:gap-y-3 mb-5 md:mb-8">
                    {room.fasilitas.split(",").map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 md:gap-2 text-on-surface-variant text-xs md:text-sm">
                        <span className="material-symbols-outlined text-primary text-[20px]">{getFeatureIcon(feature)}</span>
                        {feature.trim()}
                      </div>
                    ))}
                  </div>

                  <Link href={session ? "/dashboard" : "/register"} className="block">
                    <button className="w-full py-3 md:py-4 text-sm md:text-base bg-surface-container-high text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all duration-300 active:scale-95">
                      Pesan Sekarang
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FASILITAS UNGGULAN ========== */}
      <section id="fasilitas" className="py-14 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-on-surface mb-2 md:mb-4">Layanan Tanpa Kompromi</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto text-base lg:text-lg leading-relaxed">
              Standar fasilitas bintang lima untuk menunjang gaya hidup modern Anda yang dinamis.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {FACILITIES_DATA.map((facility, idx) => (
              <div
                key={idx}
                className="p-5 md:p-10 bg-surface-container-low rounded-2xl md:rounded-[2rem] hover:bg-primary-container transition-colors duration-300 group border border-white/50"
              >
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white flex items-center justify-center mb-3 md:mb-6 premium-shadow">
                  <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">{facility.icon}</span>
                </div>
                <h4 className="text-sm md:text-xl font-bold text-on-surface mb-1 md:mb-3">{facility.title}</h4>
                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed hidden sm:block">{facility.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== LOKASI STRATEGIS ========== */}
      <section id="lokasi" className="py-14 md:py-24 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Map / Image */}
          <div className="order-2 lg:order-1">
            {kostProfile.link_gmaps ? (
              <div className="aspect-[4/3] w-full rounded-2xl md:rounded-[2.5rem] overflow-hidden premium-shadow-lg">
                <iframe 
                  src={kostProfile.link_gmaps} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] w-full rounded-2xl md:rounded-[2.5rem] overflow-hidden premium-shadow-lg bg-gradient-to-br from-primary-container/30 via-surface-container to-surface-container-high relative flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-3 border border-gray-100 text-center max-w-[80%]">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-primary text-4xl">location_on</span>
                  </div>
                  <p className="font-bold text-on-surface text-lg">{kostProfile.nama_kost}</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{kostProfile.alamat}</p>
                </div>
              </div>
            )}
          </div>

          {/* Text Content */}
          <div className="order-1 lg:order-2 space-y-5 md:space-y-8">
            <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary-container text-on-primary-container text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em]">
              Lokasi Strategis
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-on-surface">{kostProfile.nama_kost}</h2>
            <p className="text-on-surface-variant text-sm md:text-base lg:text-lg leading-relaxed">
              Terletak di jantung kota, hanya selangkah dari pusat bisnis, universitas ternama, dan berbagai pusat perbelanjaan. Hemat waktu perjalanan Anda dan nikmati lebih banyak waktu untuk diri sendiri.
            </p>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 text-primary premium-shadow">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">Alamat</p>
                  <p className="text-on-surface-variant text-sm">{kostProfile.alamat}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 text-primary premium-shadow">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">Kontak</p>
                  <p className="text-on-surface-variant text-sm">{kostProfile.nomor_kontak}</p>
                </div>
              </div>
            </div>
            {kostProfile.link_gmaps && (
              <a href={kostProfile.link_gmaps} target="_blank" rel="noopener noreferrer">
                <button className="px-5 py-3 md:px-8 md:py-4 bg-primary text-white text-sm md:text-base font-bold rounded-xl premium-shadow hover:bg-primary-dim transition-all active:scale-95 flex items-center gap-2">
                  <span className="material-symbols-outlined">map</span>
                  Buka di Google Maps
                </button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONI ========== */}
      <section id="tentang" className="py-14 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-on-surface mb-3 md:mb-4">Apa Kata Penghuni Kami</h2>
            <div className="flex justify-center gap-1 text-primary mb-3">
              {[1,2,3,4,5].map(i => (
                <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              ))}
            </div>
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-[0.2em]">
              4.9/5 Rating berdasarkan 120+ Reviews
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {TESTIMONIALS_DATA.map((t, idx) => (
              <div 
                key={t.id} 
                className={`p-5 md:p-8 rounded-2xl md:rounded-3xl premium-shadow border border-white/50 transition-all hover:-translate-y-1 duration-300 ${
                  idx === 1 
                    ? 'bg-white md:scale-105 z-10 ring-1 ring-primary/10' 
                    : 'bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                    <span className="text-white font-bold text-sm">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{t.name}</p>
                    <p className="text-xs text-on-surface-variant">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 text-primary mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-on-surface-variant italic leading-relaxed text-sm">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA BAND ========== */}
      <section className="py-12 md:py-20 animated-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOHYyYzguODM3IDAgMTYgNy4xNjMgMTYgMTZzLTcuMTYzIDE2LTE2IDE2djJjOS45NCAwIDE4LTguMDYgMTgtMTh6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        <div className="max-w-4xl mx-auto px-5 sm:px-6 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3 md:mb-4">
            Siap Menemukan Hunian Impianmu?
          </h2>
          <p className="text-white/80 text-sm md:text-lg mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            Bergabung dengan ratusan penghuni yang sudah menikmati kenyamanan premium bersama kami.
          </p>
          <Link href={session ? (session.role === "ADMIN" ? "/admin" : "/dashboard") : "/register"}>
            <button className="px-6 py-3 md:px-10 md:py-4 bg-white text-primary font-bold rounded-xl shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all active:scale-95 text-sm md:text-lg">
              Daftar Sekarang — Gratis!
            </button>
          </Link>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-on-surface py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4 md:space-y-6 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              {kostProfile.logo_url ? (
                <img src={kostProfile.logo_url} alt={`${kostProfile.nama_kost} logo`} className="h-8 w-auto brightness-0 invert" />
              ) : (
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-primary/20">
                  {kostProfile.nama_kost.charAt(0)}
                </div>
              )}
              <span className="text-xl font-extrabold text-white">{kostProfile.nama_kost}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {kostProfile.deskripsi}
            </p>
            <div className="space-y-2 mt-4">
              <div className="flex items-start gap-2 text-xs text-gray-400">
                <span className="material-symbols-outlined text-sm text-primary mt-0.5">location_on</span>
                <span>{kostProfile.alamat}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="material-symbols-outlined text-sm text-primary">call</span>
                <span>{kostProfile.nomor_kontak}</span>
              </div>
            </div>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">Perusahaan</h4>
            <ul className="space-y-4 text-sm">
              <li><a className="text-gray-400 hover:text-primary transition-colors" href="#">Tentang Kami</a></li>
              <li><a className="text-gray-400 hover:text-primary transition-colors" href="#">Karier</a></li>
              <li><a className="text-gray-400 hover:text-primary transition-colors" href="#">Blog</a></li>
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">Bantuan</h4>
            <ul className="space-y-4 text-sm">
              <li><a className="text-gray-400 hover:text-primary transition-colors" href="#">FAQ</a></li>
              <li><a className="text-gray-400 hover:text-primary transition-colors" href="#">Pusat Bantuan</a></li>
              <li><a className="text-gray-400 hover:text-primary transition-colors" href="#">Kontak</a></li>
            </ul>
          </div>

          {/* Legalitas */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">Legalitas</h4>
            <ul className="space-y-4 text-sm">
              <li><a className="text-gray-400 hover:text-primary transition-colors" href="#">Syarat &amp; Ketentuan</a></li>
              <li><a className="text-gray-400 hover:text-primary transition-colors" href="#">Kebijakan Privasi</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-8 md:pt-12 mt-8 md:mt-12 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {kostProfile.nama_kost}. The Digital Concierge Experience.
            </p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all" href="#">
                <span className="material-symbols-outlined text-lg">language</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all" href="#">
                <span className="material-symbols-outlined text-lg">share</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
