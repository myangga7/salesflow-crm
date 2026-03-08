import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Users,
  Target,
  TrendingUp,
  Shield,
  Zap,
  Clock,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 border-b bg-white/50 backdrop-blur-sm fixed top-0 w-full z-50">
        <div className="text-2xl font-bold text-blue-600">
          Sales<span className="text-gray-900">Flow</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Pricing
          </Link>
          <Link
            href="#about"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            About
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-16 px-4 md:pt-40 md:pb-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Kelola Leads dan Customer
            <span className="text-blue-600"> Lebih Efisien</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            SalesFlow membantu tim sales mengelola leads, melacak aktivitas, dan
            meningkatkan konversi dalam satu platform terintegrasi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
              >
                Mulai Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Lihat Demo
              </Button>
            </Link>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Leads Managed</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Fitur Lengkap untuk Tim Sales
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk mengelola pipeline penjualan
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 border rounded-xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lead Management</h3>
              <p className="text-gray-600">
                Kelola leads dengan mudah, track status, dan riwayat interaksi
                dalam satu tempat.
              </p>
            </div>

            <div className="p-6 border rounded-xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pipeline Visual</h3>
              <p className="text-gray-600">
                Lihat progress leads Anda dalam pipeline yang jelas dan mudah
                dipahami.
              </p>
            </div>

            <div className="p-6 border rounded-xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Analytics Real-time
              </h3>
              <p className="text-gray-600">
                Dashboard interaktif dengan metrik penting untuk mengukur
                performa tim.
              </p>
            </div>

            <div className="p-6 border rounded-xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Activity Tracking</h3>
              <p className="text-gray-600">
                Catat setiap interaksi dengan leads: calls, emails, meetings.
              </p>
            </div>

            <div className="p-6 border rounded-xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Data Security</h3>
              <p className="text-gray-600">
                Data Anda aman dengan enkripsi dan autentikasi yang kuat.
              </p>
            </div>

            <div className="p-6 border rounded-xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Performance</h3>
              <p className="text-gray-600">
                Dibangun dengan teknologi modern untuk performa optimal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siap Meningkatkan Penjualan?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Mulai kelola leads Anda dengan lebih efisien hari ini.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 bg-white text-blue-600 hover:bg-gray-100"
            >
              Daftar Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>© 2024 SalesFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
