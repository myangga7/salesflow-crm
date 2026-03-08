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
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  TrendingUp,
  Calendar,
  Award,
  Plus,
  Edit,
  Trash,
} from "lucide-react";
import Link from "next/link";

export default async function TargetsPage() {
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

  // Ambil data leads untuk statistik
  const leads = await prisma.lead.findMany({
    where: { assignedToId: currentUser.id },
  });

  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.status === "WON").length;
  const conversionRate =
    totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0";

  // Target dummy (nanti bisa ditambahkan fitur CRUD target)
  const targets = [
    {
      id: 1,
      name: "Monthly Leads Target",
      target: 50,
      achieved: totalLeads,
      unit: "leads",
      deadline: "2024-12-31",
      icon: Target,
      color: "text-blue-500",
    },
    {
      id: 2,
      name: "Monthly Conversion Rate",
      target: 30,
      achieved: parseFloat(conversionRate),
      unit: "%",
      deadline: "2024-12-31",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      id: 3,
      name: "Won Deals Target",
      target: 15,
      achieved: wonLeads,
      unit: "deals",
      deadline: "2024-12-31",
      icon: Award,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Targets
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola target dan pencapaian Anda
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2 w-full md:w-auto">
          <Plus className="h-4 w-4" />
          Add New Target
        </Button>
      </div>

      {/* Target Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {targets.map((target) => {
          const percentage = (target.achieved / target.target) * 100;
          const Icon = target.icon;

          return (
            <Card key={target.id} className="hover:shadow-lg transition">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div
                    className={`p-2 rounded-lg bg-opacity-10 ${target.color.replace("text", "bg")}`}
                  >
                    <Icon className={`h-5 w-5 ${target.color}`} />
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg mt-2">{target.name}</CardTitle>
                <CardDescription>
                  Deadline:{" "}
                  {new Date(target.deadline).toLocaleDateString("id-ID")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-bold">
                    {target.achieved}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      / {target.target} {target.unit}
                    </span>
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      percentage >= 100
                        ? "text-green-600"
                        : percentage >= 50
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {percentage.toFixed(1)}%
                  </span>
                </div>

                <Progress value={percentage} className="h-2" />

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progress</span>
                  <span>
                    {target.achieved} / {target.target}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Monthly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
          <CardDescription>Ringkasan performa Anda bulan ini</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-xl font-bold">{totalLeads}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Won Deals</p>
                <p className="text-xl font-bold">{wonLeads}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Conversion</p>
                <p className="text-xl font-bold">{conversionRate}%</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Days Left</p>
                <p className="text-xl font-bold">
                  {Math.ceil(
                    (new Date(2024, 11, 31).getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
