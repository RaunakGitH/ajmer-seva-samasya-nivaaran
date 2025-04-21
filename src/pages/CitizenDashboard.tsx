
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserComplaints } from "@/hooks/useUserComplaints";

const HEADER_IMAGE =
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80";

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
    <main className="min-h-screen bg-muted/40">
      {/* Header */}
      <div
        className="relative h-48 md:h-56 w-full rounded-b-3xl overflow-hidden flex items-center justify-center shadow"
        style={{
          backgroundImage: `url('${HEADER_IMAGE}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow">Welcome, Citizen!</h1>
          <p className="md:text-lg text-gray-200">Track your complaints and help improve your community.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-5xl mx-auto -mt-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:scale-105 transition-transform duration-200 shadow-lg">
            <Link to="/submit-complaint" className="flex flex-col items-center p-6 h-full">
              <div className="bg-primary/10 rounded-full p-4 mb-3">
                <ArrowRight className="text-primary" size={28} />
              </div>
              <CardTitle className="mb-1 text-center">Submit Complaint</CardTitle>
              <CardDescription className="text-center">
                Easily report issues you notice around you.
              </CardDescription>
            </Link>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-200 shadow-lg">
            <Link to="/complaints" className="flex flex-col items-center p-6 h-full">
              <div className="bg-green-100 rounded-full p-4 mb-3">
                <Loader className="text-green-500" size={28} />
              </div>
              <CardTitle className="mb-1 text-center">Track Complaints</CardTitle>
              <CardDescription className="text-center">
                Follow up the status of your submitted complaints.
              </CardDescription>
            </Link>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-200 shadow-lg">
            <div className="flex flex-col items-center p-6 h-full">
              <div className="bg-violet-100 rounded-full p-4 mb-3">
                <span className="font-bold text-2xl text-primary">
                  {isLoading ? <Loader className="animate-spin" /> : complaints.length}
                </span>
              </div>
              <CardTitle className="mb-1 text-center">Total Complaints</CardTitle>
              <CardDescription className="text-center">
                Your active and past complaints in one place.
              </CardDescription>
            </div>
          </Card>
        </div>
      </div>

      {/* List of Complaints */}
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <h2 className="text-xl font-semibold mb-4">Recent Complaints</h2>
        {isLoading && <Loader className="animate-spin" />}
        {error && <div className="text-red-500">{error.message}</div>}
        {(!isLoading && complaints.length === 0) && (
          <div className="text-gray-600">No complaints submitted yet.</div>
        )}
        <div className="space-y-6">
          {complaints.slice(0,3).map((complaint: any) => (
            <Card key={complaint.id} className="transition-shadow hover:shadow-xl">
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
                    {complaint.media_urls.map((url: string) => (
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
        {complaints.length > 3 && (
          <div className="flex justify-end mt-3">
            <Link to="/complaints" className="text-primary hover:underline text-sm">
              View all &rarr;
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
