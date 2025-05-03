import { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableRow, 
  TableCell, 
  TableHead, 
  TableHeader 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useAllComplaints } from "@/hooks/useAllComplaints";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function AdminComplaints() {
  const [searchTerm, setSearchTerm] = useState('');
  const { complaints, isLoading, error } = useAllComplaints();
  
  const filteredComplaints = complaints.filter(complaint => 
    complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (complaint.user_profile && complaint.user_profile.full_name ? 
      complaint.user_profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) : false)
  );
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-500";
      case "In Progress": return "bg-blue-500";
      case "Resolved": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Complaints Management</CardTitle>
          <CardDescription>View and resolve user complaints.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search complaints..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                <span>Loading complaints...</span>
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">
                Error loading complaints. Please try again.
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="text-center py-10">
                No complaints found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-mono text-xs">{complaint.id.substring(0, 8)}</TableCell>
                      <TableCell>{complaint.user_profile && complaint.user_profile.full_name ? complaint.user_profile.full_name : 'Unknown'}</TableCell>
                      <TableCell>{complaint.category}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusBadgeColor(complaint.status)} text-white`}>
                          {complaint.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(complaint.created_at), 'yyyy-MM-dd')}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/complaint-details/${complaint.id}`}>View Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
