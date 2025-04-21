
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AdminSettings() {
  return (
    <div className="max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Panel settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-gray-500 dark:text-gray-400">
            <div className="flex justify-between items-center py-2">
              <div>Dark Mode</div>
              {/* The main theme toggle is in the layout for consistency */}
            </div>
            <div className="pt-8 text-sm">[Settings placeholder]</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
