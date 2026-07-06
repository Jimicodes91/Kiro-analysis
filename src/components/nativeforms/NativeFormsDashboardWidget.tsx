import { ClipboardList, Clock, FileCheck, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useGetNativeformsDashboard from "@/hooks/nativeforms/use-get-nativeforms-dashboard";
import { NativeFormsDashboardStats } from "@/types/nativeforms.types";

export default function NativeFormsDashboardWidget() {
  const { value: dashboardData, isLoading, isError } = useGetNativeformsDashboard();

  const stats: NativeFormsDashboardStats | null = dashboardData
    ? Array.isArray(dashboardData)
      ? null
      : (dashboardData as any)?.data ?? dashboardData
    : null;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="h-4 w-4" />
            NativeForms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !stats) {
    return null; // Don't show widget if there's an error or no data
  }

  const totalActive =
    stats.awaiting_client_count + stats.recently_submitted_count + stats.under_review_count;

  if (totalActive === 0) return null; // Don't show if nothing active

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ClipboardList className="h-4 w-4" />
          NativeForms
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.awaiting_client_count > 0 && (
          <StatRow
            icon={<Send className="h-3.5 w-3.5 text-orange-500" />}
            label="Awaiting client"
            count={stats.awaiting_client_count}
            variant="pending"
          />
        )}
        {stats.recently_submitted_count > 0 && (
          <StatRow
            icon={<FileCheck className="h-3.5 w-3.5 text-green-500" />}
            label="Recently submitted"
            count={stats.recently_submitted_count}
            variant="success"
          />
        )}
        {stats.under_review_count > 0 && (
          <StatRow
            icon={<Clock className="h-3.5 w-3.5 text-yellow-500" />}
            label="Under review"
            count={stats.under_review_count}
            variant="due"
          />
        )}
      </CardContent>
    </Card>
  );
}

function StatRow({
  icon,
  label,
  count,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  variant: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm">
        {icon}
        <span className="text-muted-foreground">{label}</span>
      </div>
      <Badge variant={variant as any} size="sm">
        {count}
      </Badge>
    </div>
  );
}
