
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2, 
  AlertCircle 
} from "lucide-react";

export type UserType = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  status: string;
  created: string;
  avatar?: string | null;
};

type UserTableProps = {
  isLoading: boolean;
  error: unknown;
  filteredUsers: UserType[];
  handleEditUser: (user: UserType) => void;
  showConfirmation: (user: UserType, action: string) => void;
};

const UserTable = ({ 
  isLoading, 
  error, 
  filteredUsers, 
  handleEditUser, 
  showConfirmation 
}: UserTableProps) => {
  return (
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
  );
};

export default UserTable;
