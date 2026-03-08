import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LeadTable } from "@/components/leads/LeadTable";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Download } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function LeadsPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Ambil user berdasarkan email
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    redirect("/login");
  }

  const leads = await prisma.lead.findMany({
    where: { assignedToId: currentUser.id },
    orderBy: { createdAt: "desc" },
  });

  // Hitung statistik
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "NEW").length;
  const contactedLeads = leads.filter((l) => l.status === "CONTACTED").length;
  const wonLeads = leads.filter((l) => l.status === "WON").length;

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header dengan judul dan tombol aksi */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Leads
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola dan track semua leads Anda
          </p>
        </div>

        {/* Tombol-tombol aksi - stack di mobile, sejajar di desktop */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="gap-2 w-full sm:w-auto justify-center"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button
            variant="outline"
            className="gap-2 w-full sm:w-auto justify-center"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Link href="/leads/new" className="w-full sm:w-auto">
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2 w-full justify-center">
              <Plus className="h-4 w-4" />
              <span>Add Lead</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistik Cards - 2 kolom di mobile, 4 kolom di desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">Semua leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{newLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">Perlu dikontak</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {contactedLeads}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Sudah dihubungi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Won</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{wonLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Berhasil konversi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Leads dengan scroll horizontal di mobile */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl">All Leads</CardTitle>
          <CardDescription className="text-sm">
            Daftar semua leads dan statusnya
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          <div className="overflow-x-auto">
            <div className="min-w-[800px] md:min-w-full">
              <LeadTable leads={leads} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
