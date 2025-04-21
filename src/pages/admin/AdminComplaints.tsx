
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableRow, TableCell, TableHead, TableHeader } from "@/components/ui/table";

export default function AdminComplaints() {
  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Complaints Management</CardTitle>
          <CardDescription>View and resolve user complaints.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>123</TableCell>
                  <TableCell>Jane Doe</TableCell>
                  <TableCell>Open</TableCell>
                  <TableCell>2024-04-11</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>124</TableCell>
                  <TableCell>John Smith</TableCell>
                  <TableCell>Resolved</TableCell>
                  <TableCell>2024-04-10</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="pt-6 text-gray-500 text-center text-sm">[List is a placeholder]</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
