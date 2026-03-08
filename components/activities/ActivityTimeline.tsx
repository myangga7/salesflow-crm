"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Phone,
  Mail,
  Calendar,
  FileText,
  MoreHorizontal,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string | null;
  dueDate: Date | null; // DIUBAH: dari string | null menjadi Date | null
  completed: boolean;
  createdAt: Date; // DIUBAH: dari string menjadi Date
  lead?: {
    id: string;
    name: string;
    company: string | null;
  };
}

interface ActivityTimelineProps {
  activities: Activity[];
  leadId?: string;
  onRefresh?: () => void;
}

const activityIcons: Record<string, any> = {
  CALL: Phone,
  EMAIL: Mail,
  MEETING: Calendar,
  NOTE: FileText,
};

const activityColors: Record<string, string> = {
  CALL: "text-blue-500 bg-blue-100",
  EMAIL: "text-green-500 bg-green-100",
  MEETING: "text-purple-500 bg-purple-100",
  NOTE: "text-gray-500 bg-gray-100",
};

export function ActivityTimeline({
  activities,
  leadId,
  onRefresh,
}: ActivityTimelineProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleComplete = async (activityId: string, completed: boolean) => {
    setLoading(activityId);
    try {
      const res = await fetch(`/api/activities/${activityId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });

      if (res.ok) {
        toast.success(
          completed ? "Activity uncompleted" : "Activity completed",
        );
        if (onRefresh) onRefresh();
      } else {
        toast.error("Failed to update activity");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (activityId: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    setLoading(activityId);
    try {
      const res = await fetch(`/api/activities/${activityId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Activity deleted");
        if (onRefresh) onRefresh();
      } else {
        toast.error("Failed to delete activity");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No activities yet</p>
        <p className="text-sm">Add your first activity to start tracking</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activityIcons[activity.type] || FileText;
        const colorClass =
          activityColors[activity.type] || "text-gray-500 bg-gray-100";

        return (
          <div
            key={activity.id}
            className={`flex items-start gap-4 p-4 border rounded-lg transition ${
              activity.completed ? "opacity-60 bg-gray-50" : ""
            }`}
          >
            <div className={`p-2 rounded-full ${colorClass}`}>
              <Icon className="h-4 w-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-medium">{activity.title}</h4>
                <Badge variant={activity.completed ? "secondary" : "default"}>
                  {activity.type}
                </Badge>
                {activity.dueDate && (
                  <Badge variant="outline">
                    Due:{" "}
                    {format(new Date(activity.dueDate), "dd MMM yyyy", {
                      locale: id,
                    })}
                  </Badge>
                )}
              </div>

              {activity.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.description}
                </p>
              )}

              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span>
                  {format(new Date(activity.createdAt), "dd MMM yyyy, HH:mm", {
                    locale: id,
                  })}
                </span>
                {activity.lead && !leadId && (
                  <>
                    <span>•</span>
                    <span>Lead: {activity.lead.name}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleComplete(activity.id, activity.completed)}
                disabled={loading === activity.id}
              >
                {activity.completed ? (
                  <XCircle className="h-4 w-4 text-gray-500" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleDelete(activity.id)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      })}
    </div>
  );
}
