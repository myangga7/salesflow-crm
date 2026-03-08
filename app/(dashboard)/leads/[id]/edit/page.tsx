import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditLeadForm } from "@/components/leads/EditLeadForm";
import { ActivityTimeline } from "@/components/activities/ActivityTimeline";
import { AddActivityForm } from "@/components/activities/AddActivityForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EditLeadPageProps {
  params: {
    id: string;
  };
}

export default async function EditLeadPage({ params }: EditLeadPageProps) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Cari user berdasarkan email
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    redirect("/login");
  }

  // Ambil data lead
  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
  });

  if (!lead) {
    redirect("/leads");
  }

  if (lead.assignedToId !== currentUser.id) {
    redirect("/leads");
  }

  // Ambil activities untuk lead ini
  const activities = await prisma.activity.findMany({
    where: { leadId: params.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lead Details</h1>
        <p className="text-muted-foreground">
          Manage lead information and track activities
        </p>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Lead Details</TabsTrigger>
          <TabsTrigger value="activities">
            Activities ({activities.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <EditLeadForm lead={lead} />
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Activity</CardTitle>
              <CardDescription>
                Log calls, emails, meetings or notes for this lead
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddActivityForm leadId={lead.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>All interactions with this lead</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={activities} leadId={lead.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
