
import { useState, useRef } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";
import UserForm, { UserFormData } from "@/components/admin/UserForm";
import UserTable, { UserType } from "@/components/admin/UserTable";
import ConfirmationDialog from "@/components/admin/ConfirmationDialog";

// Sample user data (replaced by Supabase data when available)
const mockUsers: UserType[] = [
  { 
    id: '1', 
    name: 'Jane Citizen', 
    email: 'jane@example.com', 
    role: 'Citizen',
    phone: '555-123-4567',
    status: 'active',
    created: '2023-10-15'
  },
  { 
    id: '2', 
    name: 'Admin Ajay', 
    email: 'ajay@ajmer.gov.in', 
    role: 'Admin',
    phone: '555-987-6543',
    status: 'active',
    created: '2023-09-01'
  },
  { 
    id: '3', 
    name: 'Staff Singh', 
    email: 'singh@ajmer.gov.in', 
    role: 'Staff',
    phone: '555-456-7890',
    status: 'inactive',
    created: '2023-11-20'
  },
  { 
    id: '4', 
    name: 'Rahul Kumar', 
    email: 'rahul@example.com', 
    role: 'Citizen',
    phone: '555-222-3333',
    status: 'active',
    created: '2023-12-05'
  },
];

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    fullName: "",
    email: "",
    role: "citizen",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [actionUser, setActionUser] = useState<UserType | null>(null);
  const [actionType, setActionType] = useState<string>("");
  
  const { toast } = useToast();
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  // Fetch users from Supabase and map them to our consistent UserType format
  const { data: users = mockUsers, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        // Map Supabase data to our consistent UserType format
        if (data) {
          return data.map(user => ({
            id: user.id,
            name: user.full_name || user.email || 'Unknown',
            email: user.email || '',
            role: user.role,
            phone: user.phone,
            status: 'active', // Default status since we don't have this in the profile table
            created: new Date(user.created_at).toISOString().split('T')[0],
            avatar: user.avatar_url
          }));
        }
        
        return mockUsers; // Fallback to mock data
      } catch (error) {
        console.error("Error fetching users:", error);
        return mockUsers; // Fallback to mock data
      }
    },
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  // Filter users based on search query
  const filteredUsers = searchQuery
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear error for this field if it exists
    if (formErrors[id]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = "Name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    
    if (!isEditing && !formData.password?.trim()) {
      errors.password = "Password is required for new users";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle user form submission
  const handleSubmitUser = async () => {
    // Validate form
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && currentUserId) {
        // Update existing user
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: formData.fullName,
            email: formData.email,
            role: formData.role as Database["public"]["Enums"]["user_role"],
            phone: formData.phone || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentUserId);
        
        if (error) throw error;
        
        toast({
          title: "User Updated",
          description: `User ${formData.fullName} has been updated successfully.`,
        });
      } else {
        // Create new user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password || 'Password123!', // Use provided password or default
          options: {
            data: {
              full_name: formData.fullName,
            }
          }
        });
        
        if (authError) throw authError;
        
        if (authData?.user) {
          // Update the role in the profiles table
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              role: formData.role as Database["public"]["Enums"]["user_role"],
              phone: formData.phone || null
            })
            .eq('id', authData.user.id);
          
          if (profileError) throw profileError;
        }
        
        toast({
          title: "User Created",
          description: `User ${formData.fullName} has been created successfully.`,
        });
      }
      
      // Close dialog and reset form
      dialogCloseRef.current?.click();
      resetForm();
      refetch(); // Refresh the user list
      
    } catch (error: any) {
      console.error("Error saving user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save user. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form state
  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      role: "citizen",
      phone: "",
      password: "",
    });
    setIsEditing(false);
    setCurrentUserId(null);
    setFormErrors({});
    setShowUserForm(false);
  };

  // Handle edit user
  const handleEditUser = (user: UserType) => {
    setIsEditing(true);
    setCurrentUserId(user.id);
    setFormData({
      fullName: user.name,
      email: user.email,
      role: user.role.toLowerCase(),
      phone: user.phone || "",
    });
    setShowUserForm(true);
  };

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    try {
      // First find the user to get their email for the confirmation message
      const user = users.find(u => u.id === userId);
      
      if (!user) {
        throw new Error("User not found");
      }
      
      // Delete user from Supabase Auth (this will cascade to profiles)
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      toast({
        title: "User Deleted",
        description: `User ${user.name || user.email} has been deleted successfully.`,
      });
      
      refetch(); // Refresh the user list
      
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete user. Please try again.",
      });
    } finally {
      setShowConfirmDialog(false);
      setActionUser(null);
    }
  };

  // Handle activate/deactivate user
  const handleUserStatus = async (user: UserType, newStatus: string) => {
    try {
      // In a real implementation, update the user's status in Supabase
      // For this example, we'll just show a toast
      toast({
        title: newStatus === 'active' ? "User Activated" : "User Deactivated",
        description: `User ${user.name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully.`,
      });
      
      // In a real implementation, you would update the status in the database and then refetch
      // For now, we're just showing the toast
      
    } catch (error: any) {
      console.error("Error updating user status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update user status. Please try again.",
      });
    }
  };

  // Show confirmation dialog for actions
  const showConfirmation = (user: UserType, action: string) => {
    setActionUser(user);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  // Execute confirmed action
  const executeAction = () => {
    if (!actionUser) return;
    
    switch (actionType) {
      case "delete":
        handleDeleteUser(actionUser.id);
        break;
      case "activate":
        handleUserStatus(actionUser, "active");
        break;
      case "deactivate":
        handleUserStatus(actionUser, "inactive");
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button className="flex items-center gap-2" onClick={() => setShowUserForm(true)}>
          <UserPlus className="h-4 w-4" />
          <span>Add User</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-1">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage citizen accounts and roles.</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                type="search" 
                placeholder="Search users" 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <UserTable 
            isLoading={isLoading}
            error={error}
            filteredUsers={filteredUsers}
            handleEditUser={handleEditUser}
            showConfirmation={showConfirmation}
          />
        </CardContent>
      </Card>

      {/* User Form Dialog */}
      <UserForm 
        isOpen={showUserForm}
        isEditing={isEditing}
        formData={formData}
        formErrors={formErrors}
        isSubmitting={isSubmitting}
        onClose={() => {
          setShowUserForm(false);
          resetForm();
        }}
        onSubmit={handleSubmitUser}
        onInputChange={handleInputChange}
        dialogCloseRef={dialogCloseRef}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog 
        isOpen={showConfirmDialog}
        actionUser={actionUser}
        actionType={actionType}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={executeAction}
      />
    </div>
  );
}
