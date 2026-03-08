import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LeadForm } from "@/components/leads/LeadForm";

export default async function NewLeadPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Lead</h1>
      <LeadForm />
    </div>
  );
}
