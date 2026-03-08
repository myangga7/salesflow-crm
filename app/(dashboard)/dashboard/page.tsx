import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  TrendingUp,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  Mail,
  Calendar,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function DashboardPage() {
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

  // Ambil data leads
  const leads = await prisma.lead.findMany({
    where: { assignedToId: currentUser.id },
  });

  // Ambil aktivitas terbaru
  const recentActivities = await prisma.activity.findMany({
    where: { userId: currentUser.id },
    include: {
      lead: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Hitung statistik
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "NEW").length;
  const contactedLeads = leads.filter((l) => l.status === "CONTACTED").length;
  const wonLeads = leads.filter((l) => l.status === "WON").length;
  const conversionRate =
    totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0";

  // Ikon untuk tipe activity
  const activityIcons: Record<string, any> = {
    CALL: Phone,
    EMAIL: Mail,
    MEETING: Calendar,
    NOTE: FileText,
  };

  const activityColors: Record<string, string> = {
    CALL: "text-blue-500",
    EMAIL: "text-green-500",
    MEETING: "text-purple-500",
    NOTE: "text-gray-500",
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header dengan sapaan */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Selamat datang kembali, {currentUser.name}
        </p>
      </div>

      {/* Statistik Cards - 2 kolom di mobile, 4 kolom di desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              Total Leads
            </CardTitle>
            <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{totalLeads}</div>
            <div className="flex items-center text-[10px] md:text-xs text-green-600">
              <ArrowUpRight className="h-2 w-2 md:h-3 md:w-3 mr-1" />
              <span>+12% dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              New Leads
            </CardTitle>
            <Target className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{newLeads}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              Butuh tindakan segera
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              Conversion
            </CardTitle>
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">
              {conversionRate}%
            </div>
            <div className="flex items-center text-[10px] md:text-xs text-green-600">
              <ArrowUpRight className="h-2 w-2 md:h-3 md:w-3 mr-1" />
              <span>+5% dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              Avg Response
            </CardTitle>
            <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">2.4h</div>
            <div className="flex items-center text-[10px] md:text-xs text-red-600">
              <ArrowDownRight className="h-2 w-2 md:h-3 md:w-3 mr-1" />
              <span>+30 menit</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl">Recent Activity</CardTitle>
          <CardDescription className="text-sm">
            Aktivitas terakhir dengan leads Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
          {recentActivities.length === 0 ? (
            <div className="text-center py-8 md:py-12 text-muted-foreground">
              <Clock className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm md:text-base">Belum ada aktivitas</p>
              <p className="text-xs md:text-sm">
                Mulai dengan menambahkan lead baru
              </p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activityIcons[activity.type] || FileText;
                const colorClass =
                  activityColors[activity.type] || "text-gray-500";

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-2 md:gap-4 p-2 md:p-3 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className={`mt-1 ${colorClass}`}>
                      <Icon className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm md:text-base font-medium truncate">
                        {activity.title}
                      </p>
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-[10px] md:text-xs text-muted-foreground">
                        <span>{activity.lead?.name}</span>
                        <span className="hidden md:inline">•</span>
                        <span>
                          {format(
                            new Date(activity.createdAt),
                            "dd MMM yyyy, HH:mm",
                            { locale: id },
                          )}
                        </span>
                      </div>
                    </div>
                    {!activity.completed && (
                      <span className="text-[10px] md:text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Pending
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Row - 2 kolom di mobile */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <Card>
          <CardHeader className="p-3 md:p-4">
            <CardTitle className="text-xs md:text-sm font-medium">
              Leads by Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] md:text-xs">
                <span>New</span>
                <span className="font-medium">{newLeads}</span>
              </div>
              <div className="flex justify-between text-[10px] md:text-xs">
                <span>Contacted</span>
                <span className="font-medium">{contactedLeads}</span>
              </div>
              <div className="flex justify-between text-[10px] md:text-xs">
                <span>Won</span>
                <span className="font-medium">{wonLeads}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 md:p-4">
            <CardTitle className="text-xs md:text-sm font-medium">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            <div className="space-y-2">
              <Link
                href="/leads/new"
                className="block text-[10px] md:text-xs text-blue-600 hover:underline"
              >
                + Add New Lead
              </Link>
              <Link
                href="/activities"
                className="block text-[10px] md:text-xs text-blue-600 hover:underline"
              >
                View All Activities
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
