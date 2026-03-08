import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ActivityTimeline } from "@/components/activities/ActivityTimeline";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ActivitiesPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  const activities = await prisma.activity.findMany({
    where: { userId: user.id },
    include: {
      lead: {
        select: {
          id: true,
          name: true,
          company: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const pendingActivities = activities.filter((a) => !a.completed);
  const completedActivities = activities.filter((a) => a.completed);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
        <p className="text-muted-foreground">
          Track all your interactions with leads
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({activities.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingActivities.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedActivities.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Activities</CardTitle>
              <CardDescription>
                Semua aktivitas yang pernah Anda catat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={activities} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Activities</CardTitle>
              <CardDescription>
                Aktivitas yang perlu diselesaikan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={pendingActivities} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Activities</CardTitle>
              <CardDescription>Aktivitas yang sudah selesai</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={completedActivities} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
