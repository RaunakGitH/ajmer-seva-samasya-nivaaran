
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
  AlertTriangle 
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

interface Complaint {
  id: string;
  title: string;
  category: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  date: string;
  location: string;
  description: string;
  progressPercent: number;
  hasImage: boolean;
}

const Complaints = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Mock data for complaints
  const mockComplaints: Complaint[] = [
    {
      id: 'AJM123456',
      title: 'Pothole on Civil Lines Road',
      category: 'Road',
      status: 'in_progress',
      date: '2025-04-18',
      location: 'Civil Lines, Ajmer',
      description: 'Large pothole causing traffic issues and damage to vehicles',
      progressPercent: 50,
      hasImage: true
    },
    {
      id: 'AJM234567',
      title: 'Garbage not collected for a week',
      category: 'Garbage',
      status: 'pending',
      date: '2025-04-20',
      location: 'Vaishali Nagar, Ajmer',
      description: 'The garbage dump has not been cleared for over a week causing foul smell',
      progressPercent: 20,
      hasImage: true
    },
    {
      id: 'AJM345678',
      title: 'Broken street light',
      category: 'Electricity',
      status: 'resolved',
      date: '2025-04-15',
      location: 'Station Road, Ajmer',
      description: 'Street light not working causing safety issues at night',
      progressPercent: 100,
      hasImage: false
    },
    {
      id: 'AJM456789',
      title: 'Water leakage from pipeline',
      category: 'Water',
      status: 'in_progress',
      date: '2025-04-17',
      location: 'Adarsh Nagar, Ajmer',
      description: 'Water pipeline leaking at the end of the street causing water wastage',
      progressPercent: 70,
      hasImage: true
    },
    {
      id: 'AJM567890',
      title: 'Illegal construction blocking road',
      category: 'Property',
      status: 'pending',
      date: '2025-04-19',
      location: 'Anasagar Circular Road, Ajmer',
      description: 'Unauthorized construction blocking part of the road',
      progressPercent: 10,
      hasImage: false
    }
  ];
  
  // Filter complaints based on search term and filters
  const filteredComplaints = mockComplaints.filter(complaint => {
    const matchesSearch = 
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });
  
  // Group complaints by status for tabs
  const pendingComplaints = filteredComplaints.filter(c => c.status === 'pending');
  const inProgressComplaints = filteredComplaints.filter(c => c.status === 'in_progress');
  const resolvedComplaints = filteredComplaints.filter(c => c.status === 'resolved');
  
  const renderComplaintCard = (complaint: Complaint) => {
    const statusConfig = {
      pending: { 
        label: 'Pending Review', 
        color: 'bg-amber-500',
        icon: <Clock className="h-4 w-4 text-amber-500" />
      },
      in_progress: { 
        label: 'In Progress', 
        color: 'bg-blue-500',
        icon: <AlertTriangle className="h-4 w-4 text-blue-500" />
      },
      resolved: { 
        label: 'Resolved', 
        color: 'bg-green-500',
        icon: <CheckCircle className="h-4 w-4 text-green-500" />
      },
      rejected: { 
        label: 'Rejected', 
        color: 'bg-red-500',
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />
      }
    };
    
    return (
      <Card key={complaint.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{complaint.title}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <div className="flex items-center text-xs text-gray-500 mr-3">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(complaint.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="h-3 w-3 mr-1" />
                  {complaint.location}
                </div>
              </CardDescription>
            </div>
            <Badge className={`${statusConfig[complaint.status].color} text-white`}>
              {statusConfig[complaint.status].label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Status</span>
            <span className="text-sm font-medium flex items-center">
              {statusConfig[complaint.status].icon}
              <span className="ml-1">{statusConfig[complaint.status].label}</span>
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
            <span>Complaint ID: {complaint.id}</span>
            <span>Category: {complaint.category}</span>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <Button asChild variant="outline" size="sm">
            <Link to={`/complaint-details/${complaint.id}`}>
              View Details
            </Link>
          </Button>
          
          {complaint.status === 'resolved' && (
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
                    <SelectItem value="rejected">Rejected</SelectItem>
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
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
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
                <div className="text-center py-12">
                  <p className="text-gray-500">No complaints found.</p>
                </div>
              ) : (
                <div>
                  {filteredComplaints.map(renderComplaintCard)}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="pending" className="mt-0">
              {pendingComplaints.length === 0 ? (
                <div className="text-center py-12">
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
                <div className="text-center py-12">
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
                <div className="text-center py-12">
                  <p className="text-gray-500">No resolved complaints found.</p>
                </div>
              ) : (
                <div>
                  {resolvedComplaints.map(renderComplaintCard)}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Complaints;
