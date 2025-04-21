
import { useUserComplaints } from "@/hooks/useUserComplaints";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from "lucide-react";

export default function CitizenDashboard() {
  const { complaints, isLoading, error } = useUserComplaints();

  const statusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-500";
      case "In Progress": return "bg-blue-500";
      case "Resolved": return "bg-green-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">My Complaints</h1>
      {isLoading && <Loader className="animate-spin" />}
      {error && <div className="text-red-500">{error.message}</div>}
      {(!isLoading && complaints.length === 0) && (
        <div className="text-gray-600">No complaints submitted yet.</div>
      )}
      <div className="space-y-6">
        {complaints.map((complaint: any) => (
          <Card key={complaint.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>{complaint.category}</CardTitle>
                <CardDescription className="text-xs">
                  {complaint.created_at
                    ? new Date(complaint.created_at).toLocaleString()
                    : ""}
                </CardDescription>
              </div>
              <Badge className={`${statusColor(complaint.status)} text-white`}>
                {complaint.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="mb-2 font-semibold">{complaint.description}</div>
              {complaint.media_urls && complaint.media_urls.length > 0 && (
                <div className="mb-2 flex gap-2 flex-wrap">
                  {complaint.media_urls.map((url: string, idx: number) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <img
                        src={url}
                        alt="Attachment"
                        className="w-28 h-20 object-cover rounded border"
                        loading="lazy"
                      />
                    </a>
                  ))}
                </div>
              )}
              {complaint.location_lat && complaint.location_lng && (
                <div className="text-xs text-gray-500">
                  Location: {complaint.location_lat.toFixed(4)}, {complaint.location_lng.toFixed(4)}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
