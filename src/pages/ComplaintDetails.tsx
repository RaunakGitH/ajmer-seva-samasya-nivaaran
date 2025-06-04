
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { 
  ChevronLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  User,
  MessageSquare,
  ImageIcon,
  Loader2,
  HistoryIcon,
  Download,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useComplaintDetails } from "@/hooks/useComplaintDetails";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { ComplaintUpdateForm } from "@/components/admin/ComplaintUpdateForm";
import { ComplaintHistoryTimeline } from "@/components/admin/ComplaintHistoryTimeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ComplaintLocationMap } from "@/components/complaint/ComplaintLocationMap";

const ComplaintDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  
  const { data: complaint, isLoading, error, refetch } = useComplaintDetails(id || "");
  
  // Check if user is admin or staff
  const isAdmin = localStorage.getItem('adminAuth') === 'true';
  const isStaff = localStorage.getItem('staffAuth') === 'true';
  const canUpdateStatus = isAdmin || isStaff;
  
  // Handle error in useEffect to avoid re-render loop
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load complaint details. Please try again.",
        variant: "destructive"
      });
    }
  }, [error, toast]);
  
  const getProgressPercent = (status: string) => {
    switch (status) {
      case "Pending": return 20;
      case "In Progress": return 60;
      case "Resolved": return 100;
      default: return 0;
    }
  };
  
  const getStatusConfig = (status: string) => {
    const configs = {
      'Pending': { 
        label: 'Pending Review', 
        color: 'bg-amber-500',
        icon: <Clock className="h-5 w-5 text-amber-500" />
      },
      'In Progress': { 
        label: 'In Progress', 
        color: 'bg-blue-500',
        icon: <AlertTriangle className="h-5 w-5 text-blue-500" />
      },
      'Resolved': { 
        label: 'Resolved', 
        color: 'bg-green-500',
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      }
    };
    
    return configs[status as keyof typeof configs] || configs['Pending'];
  };
  
  const handleImageDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download the image. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10 bg-gray-50">
        <Container>
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            className="mb-6 hover:bg-gray-100"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Loading complaint details...</span>
            </div>
          ) : !complaint ? (
            <Card className="text-center py-10">
              <CardContent>
                <div className="mb-4">
                  <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Complaint Not Found</h2>
                <p className="text-gray-500 mb-6">The complaint you're looking for doesn't exist or has been removed.</p>
                <Button asChild>
                  <Link to="/complaints">View All Complaints</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl mb-2">
                          Complaint about {complaint.category}
                        </CardTitle>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(complaint.created_at), 'MMM d, yyyy')}
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {complaint.user_profile?.full_name || 'Anonymous'}
                          </div>
                          {complaint.location_lat && complaint.location_lng && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              Near {complaint.location_lat.toFixed(4)}, {complaint.location_lng.toFixed(4)}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge className={`${getStatusConfig(complaint.status).color} text-white`}>
                        {getStatusConfig(complaint.status).label}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4">Status Tracking</h3>
                      
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-500">Current Status</span>
                        <span className="text-sm font-medium flex items-center">
                          {getStatusConfig(complaint.status).icon}
                          <span className="ml-1">{getStatusConfig(complaint.status).label}</span>
                        </span>
                      </div>
                      
                      <Progress 
                        value={getProgressPercent(complaint.status)} 
                        className="h-2 mb-4" 
                      />
                      
                      <div className="grid grid-cols-3 text-xs text-center">
                        <div className={`${getProgressPercent(complaint.status) >= 10 ? 'text-primary' : 'text-gray-400'} font-medium`}>
                          Submitted
                        </div>
                        <div className={`${getProgressPercent(complaint.status) >= 50 ? 'text-primary' : 'text-gray-400'} font-medium`}>
                          In Progress
                        </div>
                        <div className={`${getProgressPercent(complaint.status) === 100 ? 'text-primary' : 'text-gray-400'} font-medium`}>
                          Resolved
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <Tabs 
                      value={activeTab} 
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="mb-4">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        {complaint.location_lat && complaint.location_lng && (
                          <TabsTrigger value="location" className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            Location
                          </TabsTrigger>
                        )}
                        {(canUpdateStatus && complaint.complaint_history) && (
                          <TabsTrigger value="history" className="flex items-center gap-1">
                            <HistoryIcon className="h-4 w-4" />
                            History
                          </TabsTrigger>
                        )}
                      </TabsList>
                      
                      <TabsContent value="details">
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-4">Description</h3>
                          <p className="whitespace-pre-line text-gray-700">{complaint.description}</p>
                        </div>
                        
                        {complaint.media_urls && complaint.media_urls.length > 0 && (
                          <>
                            <Separator className="my-6" />
                            
                            <div>
                              <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <ImageIcon className="mr-2 h-5 w-5" />
                                Uploaded Evidence ({complaint.media_urls.length} file{complaint.media_urls.length > 1 ? 's' : ''})
                              </h3>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {complaint.media_urls.map((url, index) => (
                                  <div key={index} className="relative group">
                                    <div className="relative aspect-square rounded-lg overflow-hidden border bg-gray-50 shadow-sm">
                                      <img 
                                        src={url}
                                        alt={`Evidence ${index + 1}`}
                                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                        onError={(e) => {
                                          console.error("Image failed to load:", url);
                                          e.currentTarget.src = "/placeholder.svg";
                                        }}
                                      />
                                      
                                      {/* Overlay with actions for admins */}
                                      {canUpdateStatus && (
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                          <div className="flex gap-2">
                                            <Dialog>
                                              <DialogTrigger asChild>
                                                <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                                                  <Eye className="h-4 w-4" />
                                                </Button>
                                              </DialogTrigger>
                                              <DialogContent className="max-w-4xl max-h-[90vh]">
                                                <img 
                                                  src={url} 
                                                  alt={`Evidence ${index + 1} - Full Size`}
                                                  className="w-full h-auto max-h-[80vh] object-contain"
                                                />
                                              </DialogContent>
                                            </Dialog>
                                            
                                            <Button 
                                              size="sm" 
                                              variant="secondary" 
                                              className="h-8 w-8 p-0"
                                              onClick={() => handleImageDownload(url, `evidence-${index + 1}.jpg`)}
                                            >
                                              <Download className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="mt-2 text-center">
                                      <p className="text-xs text-gray-500">Evidence {index + 1}</p>
                                      {canUpdateStatus && (
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                              View Full Size
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent className="max-w-4xl max-h-[90vh]">
                                            <img 
                                              src={url} 
                                              alt={`Evidence ${index + 1} - Full Size`}
                                              className="w-full h-auto max-h-[80vh] object-contain"
                                            />
                                          </DialogContent>
                                        </Dialog>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </TabsContent>
                      
                      {complaint.location_lat && complaint.location_lng && (
                        <TabsContent value="location">
                          <ComplaintLocationMap 
                            latitude={complaint.location_lat}
                            longitude={complaint.location_lng}
                          />
                        </TabsContent>
                      )}
                      
                      {canUpdateStatus && (
                        <TabsContent value="history">
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-4">Status History</h3>
                            {complaint.complaint_history && (
                              <ComplaintHistoryTimeline historyItems={complaint.complaint_history} />
                            )}
                          </div>
                        </TabsContent>
                      )}
                    </Tabs>
                  </CardContent>
                  
                  <CardFooter className="border-t pt-6 flex justify-between">
                    {canUpdateStatus && (
                      <ComplaintUpdateForm 
                        complaintId={complaint.id} 
                        currentStatus={complaint.status}
                        onUpdateSuccess={refetch}
                      />
                    )}
                    
                    {complaint.status === 'Resolved' && !canUpdateStatus && (
                      <Button>
                        Provide Feedback
                      </Button>
                    )}
                    
                    {complaint.status !== 'Resolved' && !canUpdateStatus && (
                      <div className="text-sm text-gray-500">
                        We're working on addressing your complaint.
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Complaint Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Complaint ID</dt>
                        <dd className="mt-1 text-sm font-mono">{complaint.id}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Category</dt>
                        <dd className="mt-1 text-sm">{complaint.category}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Submitted On</dt>
                        <dd className="mt-1 text-sm">
                          {format(new Date(complaint.created_at), 'MMMM d, yyyy')}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                        <dd className="mt-1 text-sm">
                          {format(new Date(complaint.updated_at), 'MMMM d, yyyy')}
                        </dd>
                      </div>
                      {complaint.assigned_profile && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
                          <dd className="mt-1 text-sm">
                            {complaint.assigned_profile.full_name}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Contact Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">
                      Have questions about your complaint? Contact our support team.
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/contact">Contact Support</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default ComplaintDetails;
