import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

interface UserDropdownProps {
  username?: string;
  userType?: string;
}

export function UserDropdown({ username = "Admin", userType = "admin" }: UserDropdownProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleProfile = () => {
    toast({
      title: "Profile",
      description: "Profile functionality coming soon!",
    });
    setIsOpen(false);
  };

  const handleSettings = () => {
    toast({
      title: "Settings",
      description: "Settings functionality coming soon!",
    });
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
    setIsOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserTypeDisplay = (type: string) => {
    switch (type) {
      case 'admin':
        return 'Admin';
      case 'hod':
        return 'HOD';
      case 'hod-support':
        return 'HOD Support';
      case 'faculty':
        return 'Faculty';
      case 'student':
        return 'Student';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getDisplayName = (username: string) => {
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 h-auto p-2 hover:bg-accent/50 transition-colors"
        >
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              Welcome back, {getDisplayName(username)}
            </div>
            <div className="text-sm font-medium text-foreground">
              {getUserTypeDisplay(userType)}
            </div>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-xs font-medium">
              {getInitials(username)}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-card border border-border shadow-lg z-50"
        sideOffset={8}
      >
        <DropdownMenuLabel className="px-2 py-1.5">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getDisplayName(username)}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {getUserTypeDisplay(userType)} Account
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleProfile}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleSettings}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleLogout}
          className="cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10 text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}