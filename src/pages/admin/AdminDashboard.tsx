
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Admin Dashboard</CardTitle>
          <CardDescription>
            Overview and statistics coming soon. This is where you can manage complaints, users, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-gray-500 dark:text-gray-400">[Dashboard content placeholder]</div>
        </CardContent>
      </Card>
    </div>
  );
}
