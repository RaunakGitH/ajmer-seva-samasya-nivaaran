
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader, Users, Image, GalleryHorizontal } from "lucide-react";

const HEADER_IMAGE =
  "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=900&q=80";

export default function StaffDashboard() {
  // Placeholder stats for mockup
  const stats = [
    {
      title: "Assigned Complaints",
      value: "8",
      icon: <GalleryHorizontal className="text-primary" size={28} />,
      desc: "Complaints currently assigned to you.",
    },
    {
      title: "Resolved Complaints",
      value: "21",
      icon: <Image className="text-green-600" size={28} />,
      desc: "Total you have successfully resolved.",
    },
    {
      title: "Citizen Interactions",
      value: "32",
      icon: <Users className="text-violet-600" size={28} />,
      desc: "Interactions with citizens this month.",
    },
  ];

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
          <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow">Welcome, Staff!</h1>
          <p className="md:text-lg text-gray-200">Manage and resolve citizen complaints efficiently.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto -mt-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:scale-105 transition-transform duration-200 shadow-lg">
              <div className="flex flex-col items-center p-6 h-full">
                <div className="bg-primary/10 rounded-full p-4 mb-3 flex items-center justify-center">
                  {stat.icon}
                </div>
                <CardTitle className="mb-1 text-center">{stat.title}</CardTitle>
                <span className="font-bold text-2xl mb-1">{stat.value}</span>
                <CardDescription className="text-center">{stat.desc}</CardDescription>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Placeholder for staff actions */}
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card className="mb-4 transition-shadow hover:shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle>Complaint #C-12345 Assigned</CardTitle>
            <CardDescription className="text-xs">
              1 hour ago · New street light complaint assigned to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <span className="text-sm text-gray-700">
                Take action on this complaint to resolve it.
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle>Complaint #C-12312 Resolved</CardTitle>
            <CardDescription className="text-xs">
              Today · You marked a road repair complaint as resolved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <span className="text-sm text-gray-700">
                Great job! Citizens are satisfied with the resolution.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
