
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader, ArrowRight, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserComplaints } from "@/hooks/useUserComplaints";
import { SimplifiedComplaintForm } from "@/components/complaint/SimplifiedComplaintForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HEADER_IMAGE =
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1920&q=80";

export default function CitizenDashboard() {
  const { complaints, isLoading, error } = useUserComplaints();

  const statusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "In Progress": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Resolved": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-gray-100 text-gray-500 border-gray-200";
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "Pending": return <AlertTriangle className="w-4 h-4" />;
      case "In Progress": return <Loader className="w-4 h-4" />;
      case "Resolved": return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50">
      {/* Header */}
      <div
        className="relative h-[300px] md:h-[400px] w-full overflow-hidden"
        style={{
          backgroundImage: `url('${HEADER_IMAGE}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
        <div className="relative h-full max-w-5xl mx-auto px-4 flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Welcome to Your Dashboard
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
            Track your complaints and contribute to making our community better.
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="transform hover:-translate-y-1 transition-all duration-200 hover:shadow-xl bg-white/95 backdrop-blur">
            <Link to="/submit-complaint" className="flex flex-col items-center p-6">
              <div className="bg-primary/10 rounded-full p-4 mb-3">
                <ArrowRight className="text-primary w-6 h-6" />
              </div>
              <CardTitle className="mb-2">Submit Complaint</CardTitle>
              <CardDescription>Report issues in your area</CardDescription>
            </Link>
          </Card>

          <Card className="transform hover:-translate-y-1 transition-all duration-200 hover:shadow-xl bg-white/95 backdrop-blur">
            <Link to="/complaints" className="flex flex-col items-center p-6">
              <div className="bg-green-50 rounded-full p-4 mb-3">
                <FileText className="text-green-500 w-6 h-6" />
              </div>
              <CardTitle className="mb-2">Track Progress</CardTitle>
              <CardDescription>Monitor complaint status</CardDescription>
            </Link>
          </Card>

          <Card className="transform hover:-translate-y-1 transition-all duration-200 hover:shadow-xl bg-white/95 backdrop-blur">
            <div className="flex flex-col items-center p-6">
              <div className="bg-violet-50 rounded-full p-4 mb-3">
                <span className="font-bold text-2xl text-violet-500">
                  {isLoading ? <Loader className="animate-spin" /> : complaints.length}
                </span>
              </div>
              <CardTitle className="mb-2">Total Complaints</CardTitle>
              <CardDescription>Your submission history</CardDescription>
            </div>
          </Card>
        </div>
      </div>

      {/* Tabs for Complaints and Quick Submit */}
      <div className="max-w-4xl mx-auto mt-16 px-4 pb-20">
        <Tabs defaultValue="recent-complaints" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="recent-complaints">Recent Complaints</TabsTrigger>
            <TabsTrigger value="quick-submit">Quick Submit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent-complaints">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Recent Complaints</h2>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : error ? (
              <Card className="p-6 text-red-500 text-center bg-red-50">
                <p>{error.message}</p>
              </Card>
            ) : complaints.length === 0 ? (
              <Card className="p-8 text-center bg-gray-50">
                <p className="text-gray-600">No complaints submitted yet.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {complaints.slice(0, 3).map((complaint: any) => (
                  <Card key={complaint.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div>
                        <CardTitle className="text-xl font-semibold">{complaint.category}</CardTitle>
                        <CardDescription className="text-sm">
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className={`${statusColor(complaint.status)} border flex gap-2 items-center px-3 py-1`}>
                        {statusIcon(complaint.status)}
                        {complaint.status}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{complaint.description}</p>
                      {complaint.media_urls && complaint.media_urls.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {complaint.media_urls.map((url: string) => (
                            <a
                              key={url}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <img
                                src={url}
                                alt="Attachment"
                                className="w-24 h-20 object-cover rounded-lg hover:opacity-90 transition-opacity"
                                loading="lazy"
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {complaints.length > 3 && (
              <div className="mt-6 text-center">
                <Link
                  to="/complaints"
                  className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                >
                  View all complaints
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="quick-submit">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Quick Submit Complaint</h2>
            <SimplifiedComplaintForm />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
