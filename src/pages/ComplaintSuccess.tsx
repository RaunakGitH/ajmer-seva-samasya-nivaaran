
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const ComplaintSuccess = () => {
  const [progress, setProgress] = useState(0);
  const complaintId = "AJM" + Math.floor(100000 + Math.random() * 900000);
  
  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="border-green-200 shadow-md">
            <CardHeader className="text-center border-b pb-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">Complaint Submitted Successfully!</CardTitle>
              <CardDescription>Your civic issue has been reported to Ajmer Municipal Corporation</CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <p className="font-medium">Complaint ID</p>
                    <p className="font-bold">{complaintId}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Please save this ID for future reference. You can use it to track the status of your complaint.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Current Status</h3>
                    <span className="text-amber-600 font-medium">Pending Review</span>
                  </div>
                  
                  <Progress value={progress} className="h-2" />
                  
                  <div className="grid grid-cols-3 gap-2 text-xs text-center">
                    <div className="text-primary font-medium">Submitted</div>
                    <div className="text-gray-500">In Progress</div>
                    <div className="text-gray-500">Resolved</div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-blue-700">What happens next?</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Your complaint will be reviewed by the municipal authorities</li>
                    <li>It will be assigned to the relevant department</li>
                    <li>You'll receive updates as the status changes</li>
                    <li>Once resolved, you'll be asked for feedback</li>
                  </ol>
                </div>
                
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 pt-4">
                  <Button asChild className="w-full">
                    <Link to="/complaints">
                      Track My Complaints
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/">
                      Return to Home
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ComplaintSuccess;
