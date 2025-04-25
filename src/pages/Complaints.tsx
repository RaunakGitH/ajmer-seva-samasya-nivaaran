import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useUserComplaints } from '@/hooks/useUserComplaints';
import { useToast } from '@/hooks/use-toast';

interface ComplaintType {
  id: string;
  title?: string;
  category: string;
  status: string;
  description: string;
  location_lat?: number;
  location_lng?: number;
  created_at: string;
  updated_at: string;
  media_urls?: string[] | null;
  location?: string; // For display purposes
  progressPercent?: number; // Added this property to fix TypeScript errors
  date?: string; // Added this property as it's used in the code
  hasImage?: boolean; // Added this property as it might be used
}

const Complaints = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { complaints, isLoading, error, refetch } = useUserComplaints();
  const { toast } = useToast();
  
  if (error) {
    toast({
      title: "Error fetching complaints",
      description: "There was an error loading your complaints. Please try again.",
      variant: "destructive"
    });
  }

  const transformedComplaints: ComplaintType[] = complaints.map(complaint => {
    let progressPercent = 0;
    if (complaint.status === 'Pending') progressPercent = 20;
    else if (complaint.status === 'In Progress') progressPercent = 60;
    else if (complaint.status === 'Resolved') progressPercent = 100;

    const locationString = complaint.location_lat && complaint.location_lng 
      ? `Near ${complaint.location_lat.toFixed(4)}, ${complaint.location_lng.toFixed(4)}`
      : 'Location not specified';

    return {
      id: complaint.id || 'Unknown ID',
      title: `Complaint about ${complaint.category}`, // Generate title if not available
      category: complaint.category || 'Uncategorized',
      status: complaint.status || 'Pending',
      date: new Date(complaint.created_at).toISOString().split('T')[0],
      location: locationString,
      description: complaint.description || 'No description provided',
      progressPercent: progressPercent,
      hasImage: complaint.media_urls && complaint.media_urls.length > 0,
      created_at: complaint.created_at,
      updated_at: complaint.updated_at,
      media_urls: complaint.media_urls,
      location_lat: complaint.location_lat,
      location_lng: complaint.location_lng
    };
  });
  
  const filteredComplaints = transformedComplaints.filter(complaint => {
    const matchesSearch = 
      (complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) || '') || 
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || 
      complaint.status.replace(' ', '_').toLowerCase() === statusFilter;
    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });
  
  const pendingComplaints = filteredComplaints.filter(c => c.status === 'Pending');
  const inProgressComplaints = filteredComplaints.filter(c => c.status === 'In Progress');
  const resolvedComplaints = filteredComplaints.filter(c => c.status === 'Resolved');
  
  const renderComplaintCard = (complaint: ComplaintType) => {
    const statusConfig = {
      'Pending': { 
        label: 'Pending Review', 
        color: 'bg-amber-500',
        icon: <Clock className="h-4 w-4 text-amber-500" />
      },
      'In Progress': { 
        label: 'In Progress', 
        color: 'bg-blue-500',
        icon: <AlertTriangle className="h-4 w-4 text-blue-500" />
      },
      'Resolved': { 
        label: 'Resolved', 
        color: 'bg-green-500',
        icon: <CheckCircle className="h-4 w-4 text-green-500" />
      }
    };

    const status = complaint.status as keyof typeof statusConfig;
    const statusInfo = statusConfig[status] || statusConfig['Pending'];
    
    return (
      <Card key={complaint.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{complaint.title}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <div className="flex items-center text-xs text-gray-500 mr-3">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(complaint.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="h-3 w-3 mr-1" />
                  {complaint.location}
                </div>
              </CardDescription>
            </div>
            <Badge className={`${statusInfo.color} text-white`}>
              {statusInfo.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Status</span>
            <span className="text-sm font-medium flex items-center">
              {statusInfo.icon}
              <span className="ml-1">{statusInfo.label}</span>
            </span>
          </div>
          
          <Progress value={complaint.progressPercent} className="h-2 mb-4" />
          
          <div className="grid grid-cols-3 text-xs text-center mb-4">
            <div className={`${complaint.progressPercent >= 10 ? 'text-primary' : 'text-gray-400'} font-medium`}>
              Submitted
            </div>
            <div className={`${complaint.progressPercent >= 50 ? 'text-primary' : 'text-gray-400'} font-medium`}>
              In Progress
            </div>
            <div className={`${complaint.progressPercent === 100 ? 'text-primary' : 'text-gray-400'} font-medium`}>
              Resolved
            </div>
          </div>
          
          <div className="text-sm text-gray-700 mb-4">{complaint.description}</div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>Complaint ID: {complaint.id.substring(0, 8)}</span>
            <span>Category: {complaint.category}</span>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <Button asChild variant="outline" size="sm">
            <Link to={`/complaint-details/${complaint.id}`}>
              View Details
            </Link>
          </Button>
          
          {complaint.status === 'Resolved' && (
            <Button size="sm">
              Provide Feedback
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Complaints</h1>
              <p className="text-gray-600">
                Track and manage your submitted complaints
              </p>
            </div>
            
            <Button asChild className="mt-4 md:mt-0">
              <Link to="/submit-complaint">
                <Plus className="mr-2 h-4 w-4" />
                New Complaint
              </Link>
            </Button>
          </div>
          
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by ID, title, or location..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-36">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Category" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Road">Road</SelectItem>
                    <SelectItem value="Garbage">Garbage</SelectItem>
                    <SelectItem value="Water">Water</SelectItem>
                    <SelectItem value="Electricity">Electricity</SelectItem>
                    <SelectItem value="Property">Property</SelectItem>
                    <SelectItem value="Environment">Environment</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Loading your complaints...</span>
            </div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="w-full md:w-auto grid grid-cols-4 mb-6">
                <TabsTrigger value="all">
                  All ({filteredComplaints.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({pendingComplaints.length})
                </TabsTrigger>
                <TabsTrigger value="in-progress">
                  In Progress ({inProgressComplaints.length})
                </TabsTrigger>
                <TabsTrigger value="resolved">
                  Resolved ({resolvedComplaints.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                {filteredComplaints.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="mb-4 flex justify-center">
                      <AlertTriangle className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-2">No complaints found.</p>
                    <p className="text-sm text-gray-400 mb-4">Submit a new complaint to get started</p>
                    <Button asChild>
                      <Link to="/submit-complaint">
                        <Plus className="mr-2 h-4 w-4" />
                        New Complaint
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div>
                    {filteredComplaints.map(renderComplaintCard)}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="pending" className="mt-0">
                {pendingComplaints.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">No pending complaints found.</p>
                  </div>
                ) : (
                  <div>
                    {pendingComplaints.map(renderComplaintCard)}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="in-progress" className="mt-0">
                {inProgressComplaints.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">No in-progress complaints found.</p>
                  </div>
                ) : (
                  <div>
                    {inProgressComplaints.map(renderComplaintCard)}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="resolved" className="mt-0">
                {resolvedComplaints.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">No resolved complaints found.</p>
                  </div>
                ) : (
                  <div>
                    {resolvedComplaints.map(renderComplaintCard)}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Complaints;
