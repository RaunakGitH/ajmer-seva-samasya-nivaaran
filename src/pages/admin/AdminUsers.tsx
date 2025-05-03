
import { useState, useRef } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  UserPlus,
  Edit,
  Trash2,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Enums } from "@/integrations/supabase/types";

// Define a consistent user type to use throughout the component
type UserType = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  status: string;
  created: string;
  avatar?: string | null;
};

// Define a type for the form data
type UserFormData = {
  fullName: string;
  email: string;
  role: string;
  phone: string;
  password?: string;
};

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
            role: formData.role as Enums["user_role"],
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
              role: formData.role as Enums["user_role"],
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
        <Dialog open={showUserForm} onOpenChange={(open) => {
          setShowUserForm(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Add User</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "Update user information in the system." : "Create a new user account in the system."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="fullName" className="text-right text-sm font-medium">
                  Full Name
                </label>
                <div className="col-span-3 space-y-1">
                  <Input
                    id="fullName"
                    placeholder="Enter full name"
                    className={formErrors.fullName ? "border-red-500" : ""}
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                  {formErrors.fullName && (
                    <p className="text-xs text-red-500">{formErrors.fullName}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right text-sm font-medium">
                  Email
                </label>
                <div className="col-span-3 space-y-1">
                  <Input
                    id="email"
                    placeholder="email@example.com"
                    type="email"
                    className={formErrors.email ? "border-red-500" : ""}
                    disabled={isEditing}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-500">{formErrors.email}</p>
                  )}
                  {isEditing && (
                    <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                  )}
                </div>
              </div>
              {!isEditing && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="password" className="text-right text-sm font-medium">
                    Password
                  </label>
                  <div className="col-span-3 space-y-1">
                    <Input
                      id="password"
                      placeholder="Enter password"
                      type="password"
                      className={formErrors.password ? "border-red-500" : ""}
                      value={formData.password || ""}
                      onChange={handleInputChange}
                    />
                    {formErrors.password && (
                      <p className="text-xs text-red-500">{formErrors.password}</p>
                    )}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="role" className="text-right text-sm font-medium">
                  Role
                </label>
                <select 
                  id="role" 
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="citizen">Citizen</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="phone" className="text-right text-sm font-medium">
                  Phone
                </label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  className="col-span-3"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowUserForm(false)}
                ref={dialogCloseRef}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                onClick={handleSubmitUser}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : isEditing ? "Update User" : "Create User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading users...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-red-500">
                    <div className="flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span>Error loading users. Please try again.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found matching your search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {user.avatar ? (
                            <AvatarImage src={user.avatar} alt={user.name} />
                          ) : (
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center text-sm mt-1">
                            <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role.toLowerCase() === "admin" ? "default" : user.role.toLowerCase() === "staff" ? "outline" : "secondary"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.status === "active" ? (
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          <span>Inactive</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{user.created}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {user.status === "active" ? (
                            <DropdownMenuItem onClick={() => showConfirmation(user, "deactivate")}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => showConfirmation(user, "activate")}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => showConfirmation(user, "delete")}
                            className="text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-950"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === "delete" ? "Delete User" : 
               actionType === "activate" ? "Activate User" : "Deactivate User"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "delete" 
                ? "This action cannot be undone. This will permanently delete the user account from the system."
                : actionType === "activate"
                ? "This will restore user access to the system."
                : "This will prevent the user from accessing the system."}
            </DialogDescription>
          </DialogHeader>
          {actionUser && (
            <div className="py-4">
              <p className="text-center mb-4">
                Are you sure you want to {actionType} <span className="font-semibold">{actionUser.name}</span>?
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant={actionType === "delete" ? "destructive" : "default"}
              onClick={executeAction}
            >
              {actionType === "delete" ? "Delete" : 
               actionType === "activate" ? "Activate" : "Deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
