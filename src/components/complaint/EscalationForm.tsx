
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUploader } from '@/components/complaint/file-uploader';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function EscalationForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  const [complaintTitle, setComplaintTitle] = useState('');
  const [submissionDate, setSubmissionDate] = useState<Date>();
  const [department, setDepartment] = useState('');
  const [escalationReason, setEscalationReason] = useState('');
  const [stepsTaken, setStepsTaken] = useState('');
  const [escalationTo, setEscalationTo] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const departments = [
    'Roads & Infrastructure',
    'Water Supply',
    'Waste Management',
    'Electricity',
    'Urban Planning',
    'Environment',
    'Public Health',
    'Transportation'
  ];

  const escalationAuthorities = [
    'Zone Officer',
    'Assistant Municipal Commissioner',
    'Municipal Commissioner',
    'Mayor',
    'State Municipal Authority',
    'District Collector'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!complaintId.trim()) {
      setError('Please provide the complaint ID');
      return;
    }
    
    if (!complaintTitle.trim()) {
      setError('Please provide the complaint title');
      return;
    }
    
    if (!submissionDate) {
      setError('Please select the original submission date');
      return;
    }
    
    if (!department) {
      setError('Please select the concerned department');
      return;
    }
    
    if (!escalationReason.trim()) {
      setError('Please provide the reason for escalation');
      return;
    }
    
    if (!escalationTo) {
      setError('Please select who to escalate to');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      // Check if user is logged in
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        setError("Please log in to submit escalation.");
        toast.error("Authentication required", { 
          description: "Please log in to submit escalation" 
        });
        setIsSubmitting(false);
        navigate("/auth", { state: { redirectTo: "/complaints" } });
        return;
      }

      // For now, we'll create a simple escalation record
      // In a real application, you might want a separate escalations table
      const escalationData = {
        original_complaint_id: complaintId,
        complaint_title: complaintTitle,
        submission_date: submissionDate.toISOString(),
        department,
        escalation_reason: escalationReason,
        steps_taken: stepsTaken,
        escalation_to: escalationTo,
        submitted_by: submittedBy || sessionData.session.user.email || 'Unknown',
        escalated_at: new Date().toISOString(),
        files_count: files.length
      };

      // Create a complaint entry for escalation tracking
      const { data, error: insertError } = await supabase
        .from("complaints")
        .insert({
          user_id: sessionData.session.user.id,
          category: "Escalation",
          description: `ESCALATION REQUEST

Original Complaint ID: ${complaintId}
Complaint Title: ${complaintTitle}
Original Submission: ${format(submissionDate, 'PPP')}
Department: ${department}
Escalated To: ${escalationTo}

Reason for Escalation:
${escalationReason}

${stepsTaken ? `Steps Already Taken:\n${stepsTaken}` : ''}

Submitted by: ${escalationData.submitted_by}`,
          status: "Pending",
        })
        .select();

      if (insertError) {
        throw new Error("Failed to submit escalation: " + insertError.message);
      }

      toast.success("Escalation submitted successfully!");
      
      // Reset form
      setComplaintId('');
      setComplaintTitle('');
      setSubmissionDate(undefined);
      setDepartment('');
      setEscalationReason('');
      setStepsTaken('');
      setEscalationTo('');
      setSubmittedBy('');
      setFiles([]);
      
      // Redirect to complaints list
      navigate('/complaints');
    } catch (error: any) {
      console.error('Error submitting escalation:', error);
      toast.error("Escalation Failed", {
        description: error.message ?? 'There was an error submitting your escalation'
      });
      setError(error.message ?? 'There was an error submitting your escalation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelection = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Complaint Escalation Form
        </CardTitle>
        <p className="text-center text-gray-600">
          Use this form to escalate any unresolved complaints to higher municipal authorities. 
          Please ensure all details are filled accurately.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="complaint-id">Complaint ID *</Label>
              <Input
                id="complaint-id"
                placeholder="Enter the complaint ID to be escalated"
                value={complaintId}
                onChange={(e) => setComplaintId(e.target.value)}
                className="bg-white dark:bg-gray-800"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="complaint-title">Complaint Title *</Label>
              <Input
                id="complaint-title"
                placeholder="Short description of the issue"
                value={complaintTitle}
                onChange={(e) => setComplaintTitle(e.target.value)}
                className="bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Date of Original Submission *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !submissionDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {submissionDate ? format(submissionDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={submissionDate}
                    onSelect={setSubmissionDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department Concerned *</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="bg-white dark:bg-gray-800">
                  <SelectValue placeholder="Select the relevant municipal department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="escalation-reason">Reason for Escalation *</Label>
            <Textarea
              id="escalation-reason"
              placeholder="State why this complaint is being escalated"
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.target.value)}
              rows={4}
              className="bg-white dark:bg-gray-800"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="steps-taken">Steps Already Taken (Optional)</Label>
            <Textarea
              id="steps-taken"
              placeholder="Mention any staff action attempted so far"
              value={stepsTaken}
              onChange={(e) => setStepsTaken(e.target.value)}
              rows={3}
              className="bg-white dark:bg-gray-800"
            />
          </div>

          <div className="space-y-2">
            <Label>Attach Supporting Images/Documents (Optional)</Label>
            <FileUploader
              onFilesSelected={handleFileSelection}
              maxFiles={5}
              acceptedFileTypes="image/*,.pdf,.doc,.docx"
            />
            <p className="text-sm text-gray-500">
              Staff only: Upload images or documents (JPG, PNG, PDF – Max 10MB)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="escalation-to">Escalation To *</Label>
              <Select value={escalationTo} onValueChange={setEscalationTo}>
                <SelectTrigger className="bg-white dark:bg-gray-800">
                  <SelectValue placeholder="Select the higher authority" />
                </SelectTrigger>
                <SelectContent>
                  {escalationAuthorities.map((authority) => (
                    <SelectItem key={authority} value={authority}>
                      {authority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="submitted-by">Submitted By (Staff ID or Name)</Label>
              <Input
                id="submitted-by"
                placeholder="Auto-filled if possible"
                value={submittedBy}
                onChange={(e) => setSubmittedBy(e.target.value)}
                className="bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-100 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-white"
          >
            {isSubmitting ? 'Submitting Escalation...' : 'Submit Escalation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
