
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableRow, TableCell, TableHead, TableHeader } from "@/components/ui/table";

export default function AdminUsers() {
  return (
    <div className="max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage citizen accounts and roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>Jane Citizen</TableCell>
                <TableCell>jane@example.com</TableCell>
                <TableCell>User</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2</TableCell>
                <TableCell>Admin Ajay</TableCell>
                <TableCell>ajay@ajmer.gov.in</TableCell>
                <TableCell>Admin</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="pt-6 text-gray-500 text-center text-sm">[User list placeholder]</div>
        </CardContent>
      </Card>
    </div>
  );
}
