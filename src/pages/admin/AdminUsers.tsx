
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
  Plus, 
  MoreVertical, 
  UserPlus,
  Edit,
  Trash2,
  Mail,
  Phone,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Sample user data (replace with actual data from Supabase)
const mockUsers = [
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
  const { toast } = useToast();

  // Fetch users from Supabase
  const { data: users = mockUsers, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        return data || mockUsers;
      } catch (error) {
        console.error("Error fetching users:", error);
        return mockUsers; // Fallback to mock data
      }
    },
  });

  // Filter users based on search query
  const filteredUsers = searchQuery
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  const handleUserAction = (action: string, userId: string) => {
    switch (action) {
      case "edit":
        toast({
          title: "Edit User",
          description: `Editing user with ID: ${userId}`,
        });
        break;
      case "delete":
        toast({
          title: "Delete User",
          description: `User with ID: ${userId} will be deleted`,
          variant: "destructive",
        });
        break;
      case "activate":
        toast({
          title: "Activate User",
          description: `User with ID: ${userId} has been activated`,
        });
        break;
      case "deactivate":
        toast({
          title: "Deactivate User",
          description: `User with ID: ${userId} has been deactivated`,
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Add User</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account in the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  placeholder="email@example.com"
                  type="email"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="role" className="text-right text-sm font-medium">
                  Role
                </label>
                <select id="role" className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
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
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowUserForm(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={() => {
                toast({
                  title: "User Created",
                  description: "The new user has been created successfully",
                });
                setShowUserForm(false);
              }}>
                Create User
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
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
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
                      <Badge variant={user.role === "Admin" ? "default" : user.role === "Staff" ? "outline" : "secondary"}>
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
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleUserAction("edit", user.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {user.status === "active" ? (
                            <DropdownMenuItem onClick={() => handleUserAction("deactivate", user.id)}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleUserAction("activate", user.id)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleUserAction("delete", user.id)}
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
    </div>
  );
}
