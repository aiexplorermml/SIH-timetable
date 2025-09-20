import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { defaultCredentials } from "../../data/auth";

interface LoginCredentials {
  username: string;
  password: string;
  userType: 'admin' | 'hod' | 'hod-support' | 'faculty' | 'student';
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const credential = defaultCredentials.find(
      cred => cred.username === username && cred.password === password
    );

    if (credential) {
      // Store user info in localStorage (in real app, use proper auth state management)
      localStorage.setItem('user', JSON.stringify({
        username: credential.username,
        userType: credential.userType
      }));

      toast({
        title: "Login Successful",
        description: `Welcome ${credential.userType}!`,
      });

      // Redirect based on user type
      switch (credential.userType) {
        case 'admin':
          navigate('/');
          break;
        case 'hod':
        case 'hod-support':
        case 'faculty':
          navigate('/faculty');
          break;
        case 'student':
          navigate('/students');
          break;
        default:
          navigate('/');
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">College Portal</h1>
          <p className="text-muted-foreground">Sign in to access your account</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary text-primary-foreground font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground text-center mb-3">Demo Credentials:</p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span className="font-medium">Admin:</span>
                  <span>admin / admin</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">HOD:</span>
                  <span>krishna / krishna</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">HOD Support:</span>
                  <span>pavan / pavan</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Faculty:</span>
                  <span>pradeep / pradeep</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Faculty:</span>
                  <span>swaroop / swaroop</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Faculty:</span>
                  <span>srikanth / srikanth</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Student:</span>
                  <span>priya / priya</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Student:</span>
                  <span>supriya / supriya</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Student:</span>
                  <span>mahi / mahi</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Student:</span>
                  <span>vidya / vidya</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}